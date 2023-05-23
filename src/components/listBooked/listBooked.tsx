import { useState, useEffect } from "react";
import { getDay, getDate, getMonth } from "date-fns";

type bookedTimes = {
  bok_id: number,
  booking_date: string,
  start_time: string,
  end_time: string
}

/**
 * States the props for this component to use,
 * loggedIn and updateDateList is upstream events
 * for this component to use.
 * @author Sebastian Ledung
 */
interface Props {  
  loggedIn: boolean,          // Listener for other component state, if 'true', user logged in, else 'false'.                 
  updateDatelist: boolean,    // Listener for other components calling for a fetch of new times.
}

/**
 * Generates the day-string for the 'confirm'-dialog to use,
 * represents the time the client is trying to unbook in a more
 * friendly format.
 * @param date The date-object to format friendly.
 * @returns Formatted string.
 * @author Sebastian Ledung
 */
function getDayString(date: string) {
  const DATE = new Date(date);
  
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

  return DAY_STRING[getDay(DATE)] + ' ' + getDate(DATE) + ' ' + MONTH_STRING[getMonth(DATE)];
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
    if(props.loggedIn) {
      updateTimes();
    }
  }, [props.loggedIn, props.updateDatelist]);
  
  /**
   * Deletes the selected booking from the database,
   * has multiple HTTP-responses
   * 200: success
   * 500: server-error
   * 406: not authorized (could not validate session).
   * 304: non-deletion
   * @param booking The selected booking to delete.
   * @author Sebastian Ledung
   */
  async function deleteBooking(booking: bookedTimes) {
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
        body: new URLSearchParams({bookingId: booking.bok_id.toString()})
      });

      if (RESPONSE.ok) {
        setAlert('success', 'Din tid är nu avbokad.');
        updateTimes();
      } else {
        switch (RESPONSE.status) {
        case 500:
        case 304:
          setAlert('warning', 'Något gick fel med avbokningen, vänligen försök igen senare.');
          break;
        
        case 406:
          setAlert('warning', 'Kunde inte avboka din tid, vänligen logga in på nytt.');
        }
      }
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
    const ALERT = `alert listAlert alert-${type}`;

    SET_ALERT(<div className={ALERT} role="alert">{message}</div>);
    
    setTimeout (() => { // only show for 3 seconds.
      SET_ALERT(<div></div>);
    }, 5000);
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
    <div id="bookedTimes" style={{zIndex: 1}}>
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
        <span>Vänligen logga in för att se dina bokade tider</span>
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