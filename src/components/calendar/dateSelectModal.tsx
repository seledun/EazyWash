import { Modal, Button } from 'react-bootstrap'
import { useState } from 'react';
import { isWhiteSpaceLike } from 'typescript';

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
 * Up-shifts the useState to the component using this object,
 * the component importing controls the date & state of the modal.
 * @author Sebastian Ledung
 */
interface Props {  
  modalShow: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setModalShow: (show: boolean) => void;
}

function DateSelectModal(props: Props) {

  const [SELECTED_TIME, SET_SELECTED_TIME] = useState(0);
  const [BOOK_BUTTON_STATE, SET_BOOK_BUTTON_STATE] = useState(true);
  const [ALERT, SET_ALERT] = useState(<div></div>);

  /**
   * Toggled the modal (show / hide).
   * Reverts SELECTED_TIME & BOOK_BUTTON_STATE to default values.
   * @author Sebastian Ledung
   */
  function toggleModal() {
    props.setModalShow(!props.setModalShow);
    SET_SELECTED_TIME(0);
    SET_BOOK_BUTTON_STATE(true);
    SET_ALERT(<div></div>);
  }

  function setAlert(type: string, message: string) : void {
    let alert = 'alert alert-';
    
    if (type === 'success') {
      alert = alert + 'success';
    }

    else if (type === 'warning') {
      alert = alert + 'warning';
    }

    else if (type === 'danger') {
      alert = alert + 'danger';
    }

    SET_ALERT(
      <div className={alert} role="alert">
        {message}
      </div>
    );
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
    if (id !== 0) {
      SET_BOOK_BUTTON_STATE(false);
    }
  }

  /**
   * Tries to book the client-selected time slot,
   * handles the responses and tries to print out a
   * error message on error.
   * @author Sebastian Ledung
   */
  async function bookSelected() {
    try {
      const response = await fetch('/api/booking', {
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
        break;

      case 401:
        // unauthorized (not logged in).
        setAlert('danger', 'Vänligen logga in på nytt.');
        break;
        
      case 409:
        setAlert('danger', 'Det gick inte att boka din tid.');
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
        <ul className='calendarModalTimes'>
          <li key={1} className={SELECTED_TIME === 1 ? 'selected' : ''} onClick={() => selectTime(1)}>08:00 - 12:00<span className='right'>Bokad</span></li>
          <li key={2} className={SELECTED_TIME === 2 ? 'selected' : ''} onClick={() => selectTime(2)}>12:00 - 16:00<span className='right'>Obokad</span></li>
          <li key={3} className={SELECTED_TIME === 3 ? 'selected' : ''} onClick={() => selectTime(3)}>16:00 - 20:00<span className='right'>Bokad</span></li>
          <li key={4} className={SELECTED_TIME === 4 ? 'selected' : ''} onClick={() => selectTime(4)}>20:00 - 24:00<span className='right'>Bokad</span></li>
        </ul>
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