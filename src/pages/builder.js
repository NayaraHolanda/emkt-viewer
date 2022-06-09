import axios from "axios"
import { useEffect, useState } from "react"
import db from "../../../.credentials/db.json"
import Navbar from "../components/Navbar"
import styles from "../styles/pages/Builder.module.css"

export default function Builder() {
  const [clients, setClients] = useState([])
  const [base, setBase] = useState(null)

  useEffect(() => {
    axios.post('/api/git', {path: db.builderPath})
      .then(({ data }) => {
        const clientsAux = []
        data.list.map((client) => {
          if (client.type === 'dir') {
            clientsAux.push(client)
          } else {
            axios.post('/api/email', { email: client.downloadUrl })
            .then(({ data }) => {
              setBase(data)
            })
          }
        })
        setClients(clientsAux)
      })
  }, [])

  return (
    <div>
      <Navbar />
      <main className={styles.boxContent}>
        <ul className={styles.list}>
          {
            clients.map(({ name, path }) => {
              return (
                <li key={path} className={styles.listItem}>
                  <button className={styles.client}>{ name }</button>
                </li>
              )
            })
          }
        </ul>
      </main>
    </div>
  )
}