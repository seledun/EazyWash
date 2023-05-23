import { useState } from 'react';
import DateSelectModal from '@/components/calendar/dateSelectModal';
import { startOfMonth, isSameDay, addMonths, subMonths, startOfDay, isBefore, isSameMonth } from 'date-fns';

/**
 * Gets date objects for each of the dates within a month. 
 * @param month Current month for the Calendar-state.
 * @param year Current year for the Calendar-state.
 * @returns Array of Date-objects for the current month.
 * @author Sebastian Ledung
 */
function getDaysInMonth(month: number, year: number): Date[] {
  const DATE = new Date(year, month, 1);
  const DAYS: Date[] = [];

  while (DATE.getMonth() === month) {
    DAYS.push(new Date(DATE));
    DATE.setDate(DATE.getDate() + 1);
  }
  return DAYS;
}

interface Props {  
  updateDatelist: boolean,
  setUpdateDatelist: (toggle: boolean) => void
}

function Calendar(props: Props) {
  const [CURRENT_DATE, SET_CURRENT_DATE] = useState(new Date());
  const [DAYS_IN_MONTH, SET_DAYS_IN_MONTH] = useState<Date[]>([]);
  const [PADDING, SET_PADDING] = useState(Math.abs(1 - startOfMonth(CURRENT_DATE).getDay()));
  const TODAYS_DATE = new Date();

  const [MODAL_SHOW, SET_MODAL_SHOW] = useState(false);
  const [SELECTED_DATE, SET_SELECTED_DATE] = useState(new Date());

  const [IS_NEXT_MONTH, SET_IS_NEXT_MONTH] = useState(false);

  const CURRENT_MONTH = CURRENT_DATE.getMonth();
  const CURRENT_YEAR = CURRENT_DATE.getFullYear();

  /**
   * Uses the getDaysInMonth function to get number of days
   * for the supplied month, then changes the state of the DAYS-variable.
   * @author Sebastian Ledung
   */
  function updateDaysInMonth() : void {
    const DAYS = getDaysInMonth(CURRENT_MONTH, CURRENT_YEAR);
    SET_DAYS_IN_MONTH(DAYS);
  }

  /**
   * State change for the underlying date-variable, uses
   * a react hook to update the calendar when the user changes the month.
   * Reverses the calendar month by one month.
   * @author Sebastian Ledung
   */
  function goToPreviousMonth() : void { 
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH - 1, 1);
    const NEW_PADDING = Math.abs(1 - NEW_DATE.getDay());

    if (isSameMonth(subMonths(TODAYS_DATE, 1), NEW_DATE)) {
      return;
    }

    SET_IS_NEXT_MONTH(false);
    SET_CURRENT_DATE(NEW_DATE);
    SET_PADDING(NEW_PADDING);

    SET_DAYS_IN_MONTH([]);
  }

  /**
   * State change for the underlying date-variable, uses
   * a react hook to update the calendar when the user changes the month.
   * Forwards the calendar month by one month.
   * @author Sebastian Ledung
   */
  function goToNextMonth() : void {
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH + 1, 1);
    const NEW_PADDING = Math.abs(1 - NEW_DATE.getDay());

    if (isSameMonth(addMonths(TODAYS_DATE, 2), NEW_DATE)) {
      return;
    }

    SET_IS_NEXT_MONTH(true);
    SET_CURRENT_DATE(NEW_DATE);
    SET_PADDING(NEW_PADDING);
    
    SET_DAYS_IN_MONTH([]);
  }

  /**
   * Toggles modal state (show / hide)
   * @param date The date to show in the modal.
   * @author Sebastian Ledung
   */
  function toggleModal(date: Date) : void {
    SET_SELECTED_DATE(date);
    SET_MODAL_SHOW(!MODAL_SHOW);
  }

  function getDateSquareButton(date: Date) : JSX.Element {
    let classString = isSameDay(date, TODAYS_DATE) ? 'day today' : 'day';
    let inPast = false;

    const TODAY = startOfDay(TODAYS_DATE);

    if (isBefore(startOfDay(date), TODAY)) {
      classString = classString + ' inPast';
      inPast = true;
    }

    if (inPast) { // if affter 20 (latest booking) don't show modal.
      return <button key={date.getDate()} className={classString} onClick={() => false}>{date.getDate()}</button>
    } else {
      return <button key={date.getDate()} className={classString} onClick={() => toggleModal(date)}>{date.getDate()}</button>
    }
  }

  if (DAYS_IN_MONTH.length === 0) {
    updateDaysInMonth();
  }

  return (
    <div id="calendar-wrapper" style={{ zIndex: 1 }}>
      <h1 id='header'>{CURRENT_YEAR + ' ' + CURRENT_DATE.toLocaleString('SV', { month: 'short' })}</h1>
      <button className='calendarControlButton btn btn-secondary' onClick={goToPreviousMonth} disabled={!IS_NEXT_MONTH}>Föregående</button>
      <button className='calendarControlButton btn btn-secondary' onClick={goToNextMonth} disabled={IS_NEXT_MONTH}>Nästa</button>
      <div id='weekdays'>
        <div>Måndag</div>
        <div>Tisdag</div>
        <div>Onsdag</div>
        <div>Torsdag</div>
        <div>Fredag</div>
        <div>Lördag</div>
        <div>Söndag</div>
      </div>
      <ul className="calendarDayButtons">
        { 
          // Padding for the calendar, adds empty spaces if the first doesn't occur on a monday.
          Array(PADDING).fill(null).map((_, index) => (
            <button key={index} className='day padding'>
              &#8205;
            </button>
          ))
        }
        {
          // For each day of the month, add a button to the calendar (with corresponding date).
          DAYS_IN_MONTH.map(day => (
            getDateSquareButton(day) 
          ))
        }

        <br /><span className='calender-astrix'>* Det går endast att ha två inbokade tider i kalendern åt gången.</span>
      </ul>
      <DateSelectModal 
        selectedDate={SELECTED_DATE}
        modalShow={MODAL_SHOW}
        setSelectedDate={SET_SELECTED_DATE} 
        setModalShow={SET_MODAL_SHOW}
        updateDatelist={props.updateDatelist}
        setUpdateDatelist={props.setUpdateDatelist}
      />
    </div>
  );
}

export default Calendar;