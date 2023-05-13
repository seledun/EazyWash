import Head from 'next/head'
import Calendar from '@/components/calendar/calendar'
import Login from '@/components/login/login'

export default function Index() {

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        
          <Login />
                                
        </header>

        <div id='contentDiv'>
          <section id="home">EazyWash</section>
          <section></section>
          <section></section>
          <section></section>
          <section></section>
          <section id="bookTime">
            <Calendar />
          </section>
          <section id="tips">Tips</section>
          <section id="kontaktaOss">Kontakta oss</section>
        </div>
        
        <script src="main.js"></script>

      </main>
  
    </>
  )
}