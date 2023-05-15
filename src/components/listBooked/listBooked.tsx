import { useState, useEffect } from "react";

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
  
  function updateTimes() : void {
    console.log('test2');
  }

  return (
    <div id="bookedTimes">
      {props.loggedIn ? 
        <h4>Bokade tider</h4> 
        :
        <span>Logged out..</span>
      }
      <ul>
        <li>Fre, 2023-05-16 20:00 - 24:00<a className='float-right'>Avboka tid</a></li>
        <li>Fre, 2023-05-16 20:00 - 24:00<a className='float-right'>Avboka tid</a></li>  
      </ul>
    </div>
  );
}
  
export default ListBooked;