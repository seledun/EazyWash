import { useState } from 'react';
import DateSelectModal from '@/components/calendar/dateSelectModal';
import startOfMonth from 'date-fns/startOfMonth';

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

function Calendar() {
  const [CURRENT_DATE, SET_CURRENT_DATE] = useState(new Date());
  const [DAYS_IN_MONTH, SET_DAYS_IN_MONTH] = useState<Date[]>([]);
  const [PADDING, SET_PADDING] = useState(Math.abs(1 - startOfMonth(CURRENT_DATE).getDay()));

  const [MODAL_SHOW, SET_MODAL_SHOW] = useState(false);
  const [SELECTED_DATE, SET_SELECTED_DATE] = useState(new Date());

  const CURRENT_MONTH = CURRENT_DATE.getMonth();
  const CURRENT_YEAR = CURRENT_DATE.getFullYear();

  /**
   * Uses the getDaysInMonth function to get number of days
   * for the supplied month, then changes the state of the DAYS-variable.
   * @author Sebastian Ledung
   */
  function updateDaysInMonth() {
    const DAYS = getDaysInMonth(CURRENT_MONTH, CURRENT_YEAR);
    SET_DAYS_IN_MONTH(DAYS);
  }

  /**
   * State change for the underlying date-variable, uses
   * a react hook to update the calendar when the user changes the month.
   * Reverses the calendar month by one month.
   * @author Sebastian Ledung
   */
  function goToPreviousMonth() {
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH - 1, 1);
    const NEW_PADDING = Math.abs(1 - NEW_DATE.getDay());

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
  function goToNextMonth() {
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH + 1, 1);
    const NEW_PADDING = Math.abs(1 - NEW_DATE.getDay());

    SET_CURRENT_DATE(NEW_DATE);
    SET_PADDING(NEW_PADDING);
    
    SET_DAYS_IN_MONTH([]);
  }

  function toggleModal(date: Date) {
    SET_SELECTED_DATE(date);
    SET_MODAL_SHOW(!MODAL_SHOW);
  }

  if (DAYS_IN_MONTH.length === 0) {
    updateDaysInMonth();
  }

  return (
    <div>
      <h1 id='header'>{CURRENT_YEAR + ' ' + CURRENT_DATE.toLocaleString('default', { month: 'short' })}</h1>
      <button className='calendarControlButton' onClick={goToPreviousMonth}>Föregående</button>
      <button className='calendarControlButton' onClick={goToNextMonth}>Nästa</button>
      <div id='weekdays'>
        <div>Måndag</div>
        <div>Tisdag</div>
        <div>Onsdag</div>
        <div>Torsdag</div>
        <div>Fredag</div>
        <div>Lördag</div>
        <div>Söndag</div>
      </div>
      <ul>
        { 
          // Padding for the calendar, adds empty spaces if the first doesn't occur on a monday.
          Array(PADDING).fill(0).map((_, index) => (
            <button key={index} className='day padding'>
              &#8205;
            </button>
          ))
        }
        {
          // For each day of the month, add a button to the calendar (with corresponding date).
          DAYS_IN_MONTH.map(day => (
            <button key={day.getDate()} className='day' onClick={() =>toggleModal(day)}>
              {day.getDate()}
            </button>
          ))
        }
      </ul>
      <DateSelectModal 
        selectedDate={SELECTED_DATE}
        modalShow={MODAL_SHOW}
        setSelectedDate={SET_SELECTED_DATE} 
        setModalShow={SET_MODAL_SHOW}
      />
    </div>
  );
}

export default Calendar;