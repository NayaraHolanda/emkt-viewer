import 'bootstrap/dist/css/bootstrap.min.css'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <div>
        <Head>
          <title>Emkt Viewer | A Madre</title>
        </Head>
        <Navbar />
      </div>
      <div>
        <Sidebar />
      </div>
    </div>
  )
}

