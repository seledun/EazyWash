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
    'Sön',
    'Mån',
    'Tis',
    'Ons',
    'Tors',
    'Fre',
    'Lör'
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
    setLoggedIn: (status: boolean) => void
}

function ListBooked(props: Props) {
  
  const [BOOKED_TIMES, SET_BOOKED_TIMES] = useState(Array<bookedTimes>);
  const [LOADING, SET_LOADING] = useState(false);
  
  /**
   * When login-status changes to true,
   * update times from the database. 
   * @author Sebastian Ledung
   */
  useEffect(() => {
    if(props.loggedIn) {
      updateTimes();
    }
  }, [props.loggedIn]);
  
  async function deleteBooking(booking: bookedTimes) {
    if (confirm("Är du säker på att du vill avboka tiden\n" 
      + booking.booking_date + ' '
      + booking.start_time + ' - '
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
        alert("Din tid är nu avbokad.");
        updateTimes();
      }
    } else {
      return;
    }
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
      <h2 style={{textAlign: 'center'}}>Bokade tider</h2>
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
        </ul>
        :
        null  
      } 
    </div>
  );
}
  
export default ListBooked;