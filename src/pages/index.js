import 'bootstrap/dist/css/bootstrap.min.css'
import Head from "next/head"
import Image from 'next/image'
import Sidebar from "../components/Sidebar"
import styles from "../styles/pages/Home.module.css"

export default function Home() {
  return (
    <div>
      <div>
        <Head>
          <title>Emkt Viewer | A Madre</title>
        </Head>
        <header className={styles.mainHeader}>
          <h1>Email Marketing Viewer</h1>
          <Image src="/logo.png" alt="A Madre" layout="fill" className={styles.image} />
        </header>
      </div>
      <div>
        <Sidebar />
      </div>
    </div>
  )
}

