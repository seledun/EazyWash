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
  const CURRENT_MONTH = CURRENT_DATE.getMonth();
  const CURRENT_YEAR = CURRENT_DATE.getFullYear();

  function updateDaysInMonth() {
    const DAYS = getDaysInMonth(CURRENT_MONTH, CURRENT_YEAR);
    SET_DAYS_IN_MONTH(DAYS);
  }

  function goToPreviousMonth() {
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH - 1, 1);
    SET_CURRENT_DATE(NEW_DATE);
    SET_DAYS_IN_MONTH([]);
  }

  function goToNextMonth() {
    const NEW_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH + 1, 1);
    SET_CURRENT_DATE(NEW_DATE);
    SET_DAYS_IN_MONTH([]);
  }

  if (DAYS_IN_MONTH.length === 0) {
    updateDaysInMonth();
  }

  return (
    <div>
      <h1 id='header'>{CURRENT_YEAR + ' ' + CURRENT_DATE.toLocaleString('default', { month: 'short' })}</h1>
      <button className='calendarControlButton' onClick={goToNextMonth}>Next</button>
      <button className='calendarControlButton' onClick={goToPreviousMonth}>Previous</button>
      <div id='weekdays'>
        <div>monday</div>
        <div>tuesday</div>
        <div>wed.</div>
        <div>thu.</div>
        <div>friday</div>
        <div>sat.</div>
        <div>sunday</div>
      </div>
      <ul>
        {DAYS_IN_MONTH.map(day => (
          <button key={day.getDate()} className='day'>
            {day.getDate()}
          </button>
        ))}
      </ul>
    </div>
  );
}

export default Calendar;