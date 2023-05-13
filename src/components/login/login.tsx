import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function Login() {
    
  const [MODAL_SHOW, SET_MODAL_SHOW] = useState(false);
  const [AUTHENTICATED, SET_AUTHENTICATED] = useState(false);  
  const [IS_LOADING, SET_IS_LOADING] = useState(false);
  const [ALERT, SET_ALERT] = useState(<div className="modalAlert"></div>);

  const [USERNAME, SET_USERNAME] = useState("");
  const [PASSWORD, SET_PASSWORD] = useState("");

  const TOGGLE_MODAL = () => SET_MODAL_SHOW(!MODAL_SHOW);
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
    }, 3000);
  }

  async function logOut() {
    // todo
  }

  /**
   * Logs in the client to the website.
   * @author Sebastian Ledung
   */
  async function logIn() {
    SET_IS_LOADING(true);
  
    await fetch('/api/login', {
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
          setAlert('success', 'Du är nu inloggad, denna ruta stängs automatiskt.');
          setTimeout(() => {
            TOGGLE_MODAL();
          }, 3000); // Closes the modal after 3 seconds.
        } else {
          throw new Error("Authentication failed, StatusCode: " + response.status);
        }
        return response.json();
      })
      .then(json => {
        console.log(json);
      })
      .catch(function() {
        console.log("authentication failed");
        setAlert('warning', 'Fel lägenhetsnummer eller lösenord, försök igen.');
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
            void(0)
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
            void(0)  
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={TOGGLE_MODAL}>
          Stäng
          </Button>
          <Button variant="primary" onClick={() => logIn()}>Logga in</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;