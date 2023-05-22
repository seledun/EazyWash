import { Modal, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { getHours, isSameDay } from "date-fns";

type slot = {
  per_id?: number,
  start_time: string,
  end_time: string,
  slot_id?: number
}

/**
 * Formats the Date-object to a human readable format.
 * @param date Date to show in the modal window.
 * @returns String formatted date using the options provided.
 * @author Sebastian Ledung
 */
function getDateString(date: Date) : string {
  const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };

  return date.toLocaleDateString(undefined, FORMAT_OPTIONS);
}

/**
 * Converts time-start strings to time-slot ids to differentiate in the
 * user interface modal.
 * @param start_time time where the slot starts.
 * @returns ID for the slot in question.
 * @author Sebastian Ledung
 */
function getSlotIdFromStartTime(start_time : string) : number {
  switch (start_time) {
  case '08:00':
    return 1;
  
  case '12:00':
    return 2;

  case '16:00':
    return 3;

  case '20:00':
    return 4;

  default:
    return 0;
  }
}

/**
 * Formats the date to a PostgreSQL acceptable date-format (ISO-8601)
 * @param date Date to format
 * @returns Formatted date-string
 * @author Sebastian Ledung
 */
function formatDateISO8601(date: Date) : string {
  const YEAR = date.getFullYear();
  const MONTH = (date.getMonth() +1).toString().padStart(2, '0'); // months 0 - 11 (needs +1).
  const DAY = date.getDate().toString().padStart(2, '0');
  return YEAR + '-' + MONTH + '-' + DAY;
}

/**
 * Up-shifts the useState to the component using this object,
 * the component importing controls the date & state of the modal.
 * @author Sebastian Ledung
 */
interface Props {  
  modalShow: boolean,
  updateDatelist: boolean,
  selectedDate: Date,
  setSelectedDate: (date: Date) => void,
  setModalShow: (show: boolean) => void,
  setUpdateDatelist: (toggle: boolean) => void
}

function DateSelectModal(props: Props) {

  const [SELECTED_TIME, SET_SELECTED_TIME] = useState(-1); // Keeps track of which time is selected in the modal view.
  const [BOOK_BUTTON_STATE, SET_BOOK_BUTTON_STATE] = useState(true); // The state of the book button, is disabled if selection is not valid.
  const [ALERT, SET_ALERT] = useState(<div className="modalAlert"></div>); // Default alert is an empty div-tag, changes on state change.

  const [IS_LOADING, SET_IS_LOADING] = useState(true); // Loading state, displays a spinner to the user when waiting for api-response.
  const [TIME_SLOTS, SET_TIME_SLOTS] = useState(Array<slot>); // Time-slots for the current day.
  const [FETCH_OK, SET_FETCH_OK] = useState(false); // State whether the fetch was ok or not.

  const [CLIENT_DATE, SET_CLIENT_DATE] = useState(new Date());

  /**
   * When the selectedDate or modalShow changes state,
   * fetches new times from the database.
   * @author Sebastian Ledung
   */
  useEffect(() => {
    if (props.modalShow === true) {
      fetchTimeSlots();
    }
  }, [props.selectedDate, props.modalShow]);

  useEffect(() => {
    SET_CLIENT_DATE(new Date());
  }, []);

  /**
   * Fetches times from the database to list in the client view,
   * populates the li-tags in the view with information from the
   * /api/getday endpoint.
   * @author Sebastian Ledung
   */
  async function fetchTimeSlots() {
    SET_IS_LOADING(true);

    const response = await fetch(`/api/calendar/get-times?date=${formatDateISO8601(props.selectedDate)}`);
    if (response.ok) {

      const DATA = await response.json();
      const FETCHED_SLOTS : Array<slot> = DATA.data;

      const SLOTS = new Array<slot>();
      SLOTS.push({start_time: '08:00', end_time: '12:00', slot_id: 1});
      SLOTS.push({start_time: '12:00', end_time: '16:00', slot_id: 2});
      SLOTS.push({start_time: '16:00', end_time: '20:00', slot_id: 3});
      SLOTS.push({start_time: '20:00', end_time: '24:00', slot_id: 4});

      FETCHED_SLOTS.forEach(element => {
        element.start_time = element.start_time.slice(11, 16);
        element.end_time = element.end_time.slice(11, 16);

        if (element.end_time === '00:00') {
          element.end_time = '24:00';
        }

        SLOTS[getSlotIdFromStartTime(element.start_time) -1] = element;
      });

      SET_FETCH_OK(true);
      SET_TIME_SLOTS(SLOTS);
    } else {
      SET_FETCH_OK(false);
    }

    SET_SELECTED_TIME(-1);
    SET_IS_LOADING(false);

  }

  /**
   * Toggled the modal (show / hide).
   * Reverts SELECTED_TIME & BOOK_BUTTON_STATE to default values.
   * @author Sebastian Ledung
   */
  function toggleModal() {
    if (props.modalShow === true) {
      SET_TIME_SLOTS(new Array<slot>); // Clears array on close.
    }

    props.setModalShow(!props.modalShow);
    SET_SELECTED_TIME(-1);
    SET_BOOK_BUTTON_STATE(true);
    SET_ALERT(<div></div>);
  }

  /**
   * Sets the modal alert data, prints out a message to the user
   * with varying levels of importance (success | warning | danger).
   * @param type Level of importance
   * @param message Message to print to the user.
   * @author Sebastian Ledung
   */
  function setAlert(type: string, message: string) : void {
    const ALERT = `alert listAlert alert-${type}`;

    SET_ALERT(<div className={ALERT} role="alert">{message}</div>);
    
  }

  /**
   * State-selects the time pressed by the client,
   * if the selected time is valid, also change state
   * of the BOOK_BUTTON (makes booking available).
   * @param id Selected time slot in the modal (1..n).
   * @author Sebastian Ledung
   */
  function selectTime(id: number) {
    SET_SELECTED_TIME(id);
    if (id !== -1) {
      SET_BOOK_BUTTON_STATE(false);
    }
  }

  /**
   * Generates time-slots for the day (based on current time for the client)
   * if the slot end-time has passed, mark the slot as 'Passerad' and don't let the
   * client select the slot.
   * @param slot Time-slot for the day.
   * @param index Index for the time slot, for selection purposes.
   * @returns A <li> element to use in the calendar with appropriate values.
   * @author Sebastian Ledung
   */
  function getTimeSlot(slot: slot, index: number) : JSX.Element {
    
    let inPast = false;
    let className = '';

    if (isSameDay(CLIENT_DATE, props.selectedDate)) {
      if (parseInt(slot.end_time) <= getHours(CLIENT_DATE)) {
        className = className + ' modal-li-past';
        inPast = true;
      }
    }

    return (            
      <li 
        key={index} 
        className={`${
          SELECTED_TIME === index ? 'selected' : ''
        } ${
          slot.per_id === undefined ? 'modal-li-unbooked' : 'modal-li-booked'
        } ${
          className 
        }`}
        onClick={() => slot.per_id === undefined && !inPast ? selectTime(index) : void(0)}>{slot.start_time} - {slot.end_time}
        {inPast ?  
          <span 
            className='right'>Passerad
          </span>
          :
          <span 
            className='right'>{slot.per_id === undefined ? 'Ledig' : 'Bokad'}
          </span>
        }
      </li>);
  } 
  /**
   * Tries to book the client-selected time slot,
   * handles the responses and tries to print out a
   * error message on error.
   * @author Sebastian Ledung
   */
  async function bookSelected() {
    try {
      const response = await fetch('/api/calendar/book-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'day': props.selectedDate.toUTCString(),
          'timeSlot': SELECTED_TIME.toString()
        })
      });
  
      switch (response.status) {
      case 200:
        // success, time was successfully booked.
        setAlert('success', 'Tiden är nu bokad.');
        fetchTimeSlots();
        props.setUpdateDatelist(!props.updateDatelist);
        break;

      case 401:
        // unauthorized (not logged in).
        setAlert('danger', 'Vänligen logga in på nytt.');
        break;
        
      case 409:
        setAlert('danger', 'Det gick inte att boka din tid, kontrollera att du inte har för många bokade tider.');
        break;

      case 400:
        // malformed request (dates not correctly defined).
        break;

      default:
        setAlert('warning', 'Något gick fel med bokningen, vänligen försök igen senare.');
        break;
      }

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal show={props.modalShow} onHide={toggleModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{"Tider för " + getDateString(props.selectedDate)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ALERT}
        {IS_LOADING ? 
          <div className="text-center">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem', marginTop: '2rem'}} role="status" />
            <h5 className="text-center"><br />Laddar tider..</h5>
          </div>
          : 
          <ul className='calendarModalTimes'>
            {TIME_SLOTS.map((slot, index) => (
              getTimeSlot(slot, index)
            ))}
          </ul>
        }
        {!FETCH_OK ? // If time-fetching was unsuccessful.
          <div className="alert alert-warning" role="alert">
            Kunde inte hämta tider för valt datum, kontrollera att du är inloggad.
          </div>
          :
          null
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          Stäng
        </Button>
        <Button variant="primary" onClick={bookSelected} disabled={BOOK_BUTTON_STATE}>
          Boka tid
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DateSelectModal;