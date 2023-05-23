import Head from 'next/head'
import Calendar from '@/components/calendar/calendar'
import Login from '@/components/login/login'
import ListBooked from '@/components/listBooked/listBooked'
import { useState } from 'react'

export default function Index() {

  const [LOGGED_IN, SET_LOGGED_IN] = useState(false);
  const [UPDATE_DATELIST, SET_UPDATE_DATELIST] = useState(false);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/scrollreveal"></script>
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
          <Login  
            setLoggedIn={SET_LOGGED_IN}
            loggedIn={LOGGED_IN} 
          />           
        </header>

        <div id='contentDiv'>
          <section id="home">
            <div className="BigDivToClassHome">
              <div className="WelcomeHomePage"><h2>Välkommen!</h2></div>
              <div className="contentsectionHome">
                <h1 className="HomeH1">EazyWash</h1>
                <p className="contentText">
                     Välkommen till EazyWash här får du möjlighet till att boka tvättid.
                     Du kan även få hjälp med tips på hur man får bort fläckar från kläder
                </p>
              </div>
              <div className="ImgHome"><img src="washing-demo.png" /></div>
            </div>
          </section>
          <section></section>
          <section></section>
          <section></section>
          <section></section>
          <section id="bookTime">
            <Calendar 
              updateDatelist={UPDATE_DATELIST}
              setUpdateDatelist={SET_UPDATE_DATELIST}
            />
          </section>
          <section id="listTime">
            <ListBooked
              updateDatelist={UPDATE_DATELIST}
              loggedIn={LOGGED_IN} 
            />
          </section>
          <section id="tips"><div className="tips-container">
            <h2>Tips</h2>
                  
            <div className="box">
              <span>Box 1</span>
            </div>
            <div className="box">
              <span>Box 2</span>
            </div>
          </div></section>
          <section id="kontaktaOss">Kontakta oss</section>
        </div>
        
        <script src="main.js"></script>

      </main>
  
    </>
  )
}