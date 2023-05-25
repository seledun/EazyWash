import Head from 'next/head'
import Calendar from '@/components/calendar/calendar'
import Login from '@/components/login/login'
import ListBooked from '@/components/listBooked/listBooked'
import { useState } from 'react'
import SymbolsImage from '../../public/laundry-chart.jpg'
import styles from '../styles/index.module.css'

export default function Index() {

  const [LOGGED_IN, SET_LOGGED_IN] = useState(false);
  const [UPDATE_DATELIST, SET_UPDATE_DATELIST] = useState(false);
  console.log(SymbolsImage);
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
            <li><a href="#bookTime" hidden={LOGGED_IN ? false : true}>Boka tid</a></li>
            <li><a href="#listTime" hidden={LOGGED_IN ? false : true}>Bokade tider</a></li>
            <li><a href="#tips"> Tips</a></li>
            <li><a href="#kontaktaOss"> Kontakta oss</a></li>
          </ul>
          <Login  
            setLoggedIn={SET_LOGGED_IN}
            loggedIn={LOGGED_IN} 
          />           
        </header>
        <div id='contentDiv' style={{zIndex: 1}}>
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
          <section id="bookTime" hidden={LOGGED_IN ? false : true}>
            <Calendar 
              updateDatelist={UPDATE_DATELIST}
              setUpdateDatelist={SET_UPDATE_DATELIST}
            />
          </section>
          <section id="listTime" hidden={LOGGED_IN ? false : true}>
            <ListBooked
              updateDatelist={UPDATE_DATELIST}
              loggedIn={LOGGED_IN} 
            />
          </section>
          <section id="tips"><div className="tips-container">
            <h2>Tips</h2>
                  
            <div className={styles.box}>
             <img width='820' className={styles.symbols} alt ='washing symbols' src={SymbolsImage.src} /> 
            </div>
            
            
          </div></section>
          <section id="kontaktaOss" className={styles.contactSection}>
          <h2 className={styles.contactTitle}>Kontakta oss</h2> 
          <p className={styles.mail}>EazyWash@no-reply.com</p>
          </section>
        </div>
        <script src="main.js"></script>
      </main>
    </>
  )
}