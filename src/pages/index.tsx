import Head from 'next/head'
import styles from '@/styles/index.module.css'

export default function Index() {
  return (
    <>
      <Head>
        <title>Document</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
      </Head>

      <main className={styles.main}>
        <header>
          <a href="#"className="logo"><i className='bx bxs-washer'></i><span>EazyWash</span></a>

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
      </main>

      <section id="home">EazyWash</section>
      <section></section>
      <section></section>
      <section></section>
      <section></section>
      <section id="bookTime">BokaTid</section>
      <section id="tips">Tips</section>
      <section id="kontaktaOss">Kontakta oss</section>
      <script src="main.js" />
    </>
  )
}