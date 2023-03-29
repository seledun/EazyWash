import Head from 'next/head'
import Image from 'next/image'
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
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js" integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N" crossOrigin="anonymous" async></script>
      </Head>

      <main className={styles.main}>
          <header className='container-fluid header'>            
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container-fluid">
                <a className="navbar-brand" href="#"><i className="bx bxs-washer"></i>EazyWash</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a className="nav-link active" aria-current="page" href="#">Boka tvättid</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Felanmälan</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Om oss</a>
                    </li>
                  </ul>
                  <ul className="navbar-nav mb-2 mb-lg-0"> 
                      <li className="nav-item">
                      <a className="nav-link" href="#"><i className="ri-user-fill"></i>Logga in</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Registrera</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
      </main>


      <div className="container-xl content">
        <Image src="/xp.png" width={1000} height={1000} alt="background image" />
      </div>

      <div className='container'>
        <h1>
          Implementation av boka tvättid
        </h1>
      </div>

    </>
  )
}