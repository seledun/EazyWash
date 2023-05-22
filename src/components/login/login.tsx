import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

/**
 * Up-shifts the useState to the component using this object,
 * the component importing controls the date & state of the modal.
 * @author Sebastian Ledung
 */
interface Props {  
  loggedIn: boolean,
  setLoggedIn: (status: boolean) => void
}

function Login(props: Props) {
    
  const [MODAL_SHOW, SET_MODAL_SHOW] = useState(false);
  const [AUTHENTICATED, SET_AUTHENTICATED] = useState(false);  
  const [IS_LOADING, SET_IS_LOADING] = useState(false);
  const [ALERT, SET_ALERT] = useState(<div className="modalAlert"></div>);

  const [INITIAL_LOAD, SET_INITIAL_LOAD] = useState(false);

  const [USERNAME, SET_USERNAME] = useState("");
  const [PASSWORD, SET_PASSWORD] = useState("");

  const TOGGLE_MODAL = () => SET_MODAL_SHOW(!MODAL_SHOW);

  /**
   * On-load check if the client is already logged in,
   * and then update the user interface to match the authentication
   * status.
   * @author Sebastian Ledung
   */
  useEffect(() => {
    if (!INITIAL_LOAD) {
      SET_INITIAL_LOAD(true);
      isAuthenticated();
    }
  }, []);

  /**
   * Sends a GET-request to the API to get client authentication status.
   * @author Sebastian Ledung
   */
  async function isAuthenticated() {
    const RESPONSE = await fetch('/api/auth/check-authentication');

    if (RESPONSE.ok) {
      RESPONSE.json().then((json) => {
        if (json.username !== undefined) {
          SET_USERNAME(json.username);
          SET_AUTHENTICATED(true);
          props.setLoggedIn(true);
        }
      });
    }
    SET_INITIAL_LOAD(false);
  }

  /**
   * Sets the modal alert data, prints out a message to the user
   * with varying levels of importance (success | warning | danger).
   * @param type Level of importance
   * @param message Message to print to the user.
   * @author Sebastian Ledung
   */
  function setAlert(type: string, message: string) : void {
    let alert = 'alert modalAlert alert-';
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
      SET_ALERT(<div className="modalAlert"></div>);
    }, 2000);
  }

  /**
   * Does a GET-request to the logout endpoint
   * which in turn deletes the session-cookies
   * @author Sebastian Ledung
   */
  async function logOut() {
    const RESPONSE = await fetch('/api/auth/logout');

    if (RESPONSE.ok) {
      RESPONSE.json().then(() => {
        SET_USERNAME('');           // Clears state-variables.
        SET_PASSWORD('');           // Clears state-variables.
        SET_AUTHENTICATED(false);   // Clears state-variables.
        props.setLoggedIn(false);   // Clears state-variables.
        alert("Du är nu utloggad.");
      });
    }
  }
  /**
   * Logs in the client to the website,
   * sends the username & password to the api
   * which in turn sets the user cookie.
   * @author Sebastian Ledung
   */
  async function logIn() {
    SET_IS_LOADING(true);
  
    await fetch('/api/auth/login', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
        'id': USERNAME,
        'pin': PASSWORD
      })
    })
      .then(response => {
        SET_IS_LOADING(false);

        if (response.ok) {
          SET_AUTHENTICATED(true);
          props.setLoggedIn(true);
          setAlert('success', 'Du är nu inloggad, denna ruta stängs automatiskt.');
          setTimeout(() => {
            TOGGLE_MODAL();
          }, 2000); // Closes the modal after 2 seconds.
        } else {
          throw new Error("Authentication failed, StatusCode: " + response.status);
        }
        return response.json();
      })
      .catch(function() {
        setAlert('danger', 'Fel lägenhetsnummer eller lösenord, försök igen.');
        SET_AUTHENTICATED(false);
      })
      .finally(function() {
        SET_IS_LOADING(false);
      });
  }

  return (
    <div className="main">
      {!AUTHENTICATED ? 
        <a className="user" onClick={TOGGLE_MODAL}><i className="ri-user-fill"></i>Logga in</a>
        :
        <a className="user" onClick={() => logOut()}><i className='ri-logout-box-fill'></i>{USERNAME} - Logga ut</a>
      }
      <Modal show={MODAL_SHOW} onHide={TOGGLE_MODAL} centered>
        <Modal.Header closeButton>
          <Modal.Title>Logga in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ALERT}
          {IS_LOADING ? 
            <div className="text-center">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem', marginTop: '2rem'}} role="status" />
              <h5 className="text-center"><br />Loggar in..</h5>
            </div>
            :
            null
          }
          {!AUTHENTICATED && !IS_LOADING ?
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Lägenhetsnummer</Form.Label>
                <Form.Control type="username" placeholder="Lägenhetsnummer" autoFocus onChange={e => SET_USERNAME(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Lösenord</Form.Label>
                <Form.Control type="password" placeholder="Lösenord" onChange={e => SET_PASSWORD(e.target.value)} />
              </Form.Group>
            </Form>
            :
            null  
          }
        </Modal.Body>
        
        {!AUTHENTICATED && !IS_LOADING ? 
          <Modal.Footer>
            <Button variant="secondary" onClick={TOGGLE_MODAL}>
            Stäng
            </Button>
            <Button variant="primary" onClick={() => logIn()}>Logga in</Button>  
          </Modal.Footer>
          :
          null
        }
      </Modal>
    </div>
  );
}

export default Login;