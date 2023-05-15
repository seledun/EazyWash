import BookTime from "@/pages/api/calendar/book-time";
import { useState, useEffect } from "react";

type bookedTimes = {
  bok_id: number,
  booking_date: string,
  start_time: string,
  end_time: string
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

function deleteBooking(bok_id: number) {
  console.log(bok_id);
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
    setTimeout(() => {
      SET_LOADING(false);
    }, 3000);
  }

  return (
    <div id="bookedTimes">
      <h4>Bokade tider</h4>
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
            <li key={key}>{time.booking_date} {time.start_time} - {time.end_time}<a onClick={() => deleteBooking(time.bok_id)} className='float-right'>Avboka tid</a></li>
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