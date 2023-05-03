import { useState } from 'react';

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
  const [PADDING, SET_PADDING] = useState(Math.abs(1 - CURRENT_DATE.getDay()));

  const CURRENT_MONTH = CURRENT_DATE.getMonth();
  const CURRENT_YEAR = CURRENT_DATE.getFullYear();

  function updateDaysInMonth() {
    const DAYS = getDaysInMonth(CURRENT_MONTH, CURRENT_YEAR);
    SET_DAYS_IN_MONTH(DAYS);
  }

  function goToPreviousMonth() {
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH - 1, 1);
    const NEW_PADDING = Math.abs(1 - NEW_DATE.getDay());

    SET_CURRENT_DATE(NEW_DATE);
    SET_PADDING(NEW_PADDING);

    SET_DAYS_IN_MONTH([]);
  
    console.log("Padding: " + PADDING);
  }

  function goToNextMonth() {
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH + 1, 1);
    const NEW_PADDING = Math.abs(1 - NEW_DATE.getDay());

    SET_CURRENT_DATE(NEW_DATE);
    SET_PADDING(NEW_PADDING);
    
    SET_DAYS_IN_MONTH([]);

    console.log("Padding: " + PADDING);
  }

  if (DAYS_IN_MONTH.length === 0) {
    updateDaysInMonth();
  }

  return (
    <div>
      <h1 id='header'>{CURRENT_YEAR + ' ' + CURRENT_DATE.toLocaleString('default', { month: 'short' })}</h1>
      <button className='calendarControlButton' onClick={goToPreviousMonth}>Previous</button>
      <button className='calendarControlButton' onClick={goToNextMonth}>Next</button>
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
          Array(PADDING).fill(0).map((_, index) => (
            <button key={index} className='day padding'>
              *
            </button>
          ))
        }
        {
          DAYS_IN_MONTH.map(day => (
            <button key={day.getDate()} className='day' onClick={() => console.log(day)}>
              {day.getDate()}
            </button>
          ))
        }
      </ul>
    </div>
  );
}

export default Calendar;