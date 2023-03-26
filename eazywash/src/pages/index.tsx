import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/index.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Index() {
  return (
    <>
      <Head>
        <title>Document</title>
        <meta charSet='UTF-8' />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
      </Head>
      <main className={styles.main}>
      <header>
        <a href="#"className="logo"><i className='bx bxs-washer' /><span>EazyWash</span></a>
        <ul className="navbar">
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#">Boka tid</a></li>
            <li><a href="#">Tips</a></li>
            <li><a href="#">Kontakta oss</a></li>
        </ul>
        <div className="main">
            <a href="#" className="user"><i className="ri-user-fill"></i>Logga In</a>
            <a href="#">Registera</a>
            <div className="bx bx-menu"id="menu-icon"></div>            
        </div>
     </header>
        <div className="videoBackground">
            <video autoPlay={true} loop muted className="back-video">
                <source src="laundry-basics.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="tips-box">
            <div className="divbox">
              <h2>This is the content of the first div box</h2>
              <p>Here is some text for the first div box</p>
            </div>
            <div className="divbox">
              <h2>This is the content of the second div box</h2>
              <p>Here is some text for the second div box</p>
            </div>
          </div>
      </main>
    </>
  )
}
