import { useState, useEffect } from "react";
import { getDay, getDate, getMonth } from "date-fns";

type bookedTimes = {
  bok_id: number,
  booking_date: string,
  start_time: string,
  end_time: string
}

function getDayString(date: string) {
  const DATE = new Date(date);
  const DAY = getDay(DATE);
  const DATE_IN_MONTH = getDate(DATE);
  const MONTH = getMonth(DATE);

  const DAY_STRING: string[] = [
    'Söndag',
    'Måndag',
    'Tisdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lördag'
  ];
  
  const MONTH_STRING: string[] = [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Jun',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December'
  ];

  return DAY_STRING[DAY] + ' ' + DATE_IN_MONTH + ' ' + MONTH_STRING[MONTH];
}

/**
 * Up-shifts the useState to the component using this object,
 * the component importing controls the date & state of the modal.
 * @author Sebastian Ledung
 */
interface Props {  
    loggedIn: boolean,
    setLoggedIn: (status: boolean) => void,
    updateDatelist: boolean,
    setUpdateDatelist: (toggle: boolean) => void
}

function ListBooked(props: Props) {
  
  const [BOOKED_TIMES, SET_BOOKED_TIMES] = useState(Array<bookedTimes>);
  const [LOADING, SET_LOADING] = useState(false);
  const [ALERT, SET_ALERT] = useState(<div></div>)

  /**
   * When login-status changes to true,
   * update times from the database. 
   * @author Sebastian Ledung
   */
  useEffect(() => {
    console.log('allo');
    if(props.loggedIn) {
      updateTimes();
    }
  }, [props.loggedIn, props.updateDatelist]);
  
  async function deleteBooking(booking: bookedTimes) {

    // {getDayString(time.booking_date)}, {time.start_time} - {time.end_time}

    if (confirm("Är du säker på att du vill avboka din tvättid\n" 
      + getDayString(booking.booking_date) + ', '
      + booking.start_time + '-'
      + booking.end_time + '?'
    )) {
      const RESPONSE = await fetch('/api/calendar/delete-booking', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },    
        body: new URLSearchParams({
          bookingId: booking.bok_id.toString()
        })
      })

      if (RESPONSE.ok) {
        setAlert('success', 'Din tid är nu avbokad.');
        updateTimes();
      } else {
        if (RESPONSE.status === 406) {
          setAlert('warning', 'Kunde inte avboka din tid, vänligen logga in på nytt.');
        } 
        else if (RESPONSE.status === 304 || RESPONSE.status === 500) {
          setAlert('warning', 'Något gick fel med avbokningen, vänligen försök igen senare.');
        } 
      }
    } else {
      return;
    }
  }
 
  /**
   * Sets the modal alert data, prints out a message to the user
   * with varying levels of importance (success | warning | danger).
   * @param type Level of importance
   * @param message Message to print to the user.
   * @author Sebastian Ledung
   */
  function setAlert(type: string, message: string) : void {
    let alert = 'alert listAlert alert-';
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
    setTimeout (() => { // only show for 2 seconds.
      SET_ALERT(<div></div>);
    }, 3000);
  }

  /**
   * Fetches booked times for the client,
   * uses a spinner as a wait for the server to respond.
   * @author Sebastian Ledung
   */
  async function updateTimes() {
    SET_LOADING(true);

    const RESPONSE = await fetch('/api/calendar/get-booked-times');
    if (RESPONSE.ok) {

      const DATA = await RESPONSE.json();
      const TIMES_ARRAY : Array<bookedTimes> = DATA.data;
      const NEW_TIMES_ARRAY = new Array<bookedTimes>;
      
      TIMES_ARRAY.forEach(element => (
        NEW_TIMES_ARRAY.push({
          bok_id: element.bok_id,
          booking_date: element.booking_date.slice(0, 10),
          start_time: element.start_time.slice(11, 16),
          end_time: element.end_time.slice(11, 16) === '00:00' ? '24:00' : element.end_time.slice(11, 16) 
        })
      ));
    
      SET_BOOKED_TIMES(NEW_TIMES_ARRAY); 
    }
    SET_LOADING(false);
  }

  return (
    <div id="bookedTimes">
      <h2 style={{textAlign: 'center'}}>Dina bokade tider</h2>
      {ALERT}
      {LOADING ? 
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem', marginTop: '1rem'}} role="status" />
          <h5 className="text-center"><br />Laddar in bokade tider</h5>
        </div>
        : 
        null
      } 
      {!props.loggedIn && !LOADING ? 
        <span>Vänligen logga in för att se dina bokade tider.</span>
        :
        null
      }
      {props.loggedIn && !LOADING ?
        <ul>
          {BOOKED_TIMES.map((time, key) => (
            <li key={key}>{getDayString(time.booking_date)}, {time.start_time} - {time.end_time}<a onClick={() => deleteBooking(time)} className='float-right'>Avboka tid</a></li>
          ))
          }
          {BOOKED_TIMES.length > 0 ? null : <span>Du har inga bokade tider för närvarande</span>}
        </ul>
        :
        null  
      } 
    </div>
  );
}
  
export default ListBooked;