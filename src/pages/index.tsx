import Head from 'next/head'

export default function Index() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="main.js"></script>
        <title>Document</title>
      </Head>

      <main>
        <header>
          <a href="#" className="logo"><i className='bx bxs-washer'></i><span>EazyWash</span></a>

          <ul className="navbar">
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#bookTime">Boka Tid</a></li>
            <li><a href="#tips"> Tips</a></li>
            <li><a href="#kontaktaOss"> Kontakta oss</a></li>
          </ul>
        

          <div className="main">
            <a href="#" className="user"><i className="ri-user-fill"></i>Logga in</a>
          </div>
          <div className="popup">
            <div className="popup-content">
              <form><i className="ri-user-fill"></i>
                <button data-close-button className="btn-close">&times;</button>
                <h2>Sign in</h2>
                <div className="InputBox">
                  <input type="text" required={true} />
                  <span>Username</span>
                  <i></i>
                </div>
                <div className="InputBox">
                  <input type="password" required={true} />
                  <span>password</span>
                  <i></i>
                </div>
                <div className="Links"> 
                  <a href="#">Forgot Password</a>
                </div>
                <a href="#" className="button">Login</a>
              </form>
            </div>
          </div>
                                
        </header>

        <section id="home">EazyWash</section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
        <section id="bookTime">
          <h1>BokaTid</h1>
        
          <div id="container">
            <div id="header">
              <div id="monthDisplay"></div>
              <div>
                <button id="backButton">Bakåt</button>
                <button id="nextButton">Framåt</button>
              </div>
            </div>

            <div id="weekdays">
              <div>Måndag</div>
              <div>Tisdag</div>
              <div>Onsdag</div>
              <div>Torsdag</div>
              <div>Fredag</div>
              <div>Lördag</div>
              <div>Söndag</div>
            </div>

            <div id="calendar"></div>
          </div>

          <div id="newEventModal">
            <h2>Boka tid</h2>
      
      
            <button id="Tid1">8:00- 12:00</button>
            <button id="Tid2">12:00-16:00</button>
            <button id="Tid3">16:00-20:00</button>
            <button id="Tid4">20:00-24:00</button>

            <button id="saveButton">Spara</button>
            <button id="cancelButton">Avbryt</button>
          </div>

          <div id="deleteEventModal">
            <h2>Event</h2>

            <p id="eventText"></p>

            <button id="deleteButton">Ta bort</button>
            <button id="closeButton">Stäng</button>
          </div>

          <div id="modalBackDrop"></div>


        </section>
        <section id="tips">Tips</section>
        <section id="kontaktaOss">Kontakta oss</section>
     
        <script src="script.js"></script>

      </main>
  
    </>
  )
}