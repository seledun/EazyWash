import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/index.module.css'
import backgroundImage from 'public/xp.png'
import loginImage from 'public/user.svg'
import washerLogo from 'public/washer.svg'


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
          <header className='container-fluid header'>            
            <nav className="navbar navb navbar-dark bg-dark navbar-expand-lg">
              <div className="container-fluid">
                <a className="navbar-brand" href="#"><Image src={washerLogo} alt="Logotyp" />EazyWash</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
                  <li className="nav-item">
                      <a className="nav-link mx-4 my-2" href="#">Home</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link mx-4 my-2" href="#">Boka tid</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link mx-4 my-2" href="#">Tips</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link mx-4 my-2" href="#">Kontakta oss</a>
                    </li>
                  </ul>
                  <ul className="navbar-nav mb-2 mb-lg-0"> 
                      <li className="nav-item">
                      <a className="nav-link mx-4 my-2" href="#"><Image src={loginImage} alt="Login image" />Logga in</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link mx-4 my-2" href="#">Registrera</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
      </main>

      <div className="container-fluid">
        <Image src={backgroundImage} alt="background image" />
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
        </div>

    </>
  )
}