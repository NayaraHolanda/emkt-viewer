import { useEffect, useState } from 'react'
import axios from 'axios'
import db from '../../../.credentials/db.json'
import EmailPartials from '../components/EmailPartials'
import Navbar from '../components/Navbar'
import styles from '../styles/pages/Builder.module.css'

export default function Builder() {
  const [clients, setClients] = useState([])
  const [base, setBase] = useState(null)
  const [clientPath, setClientPath] = useState(null)

  useEffect(() => {
    axios.post('/api/git', { path: db.builderPath })
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

  function handleClickClient(path) {
    setClientPath(path)
  }

  return (
    <div>
      <Navbar />
      <main className={styles.boxContent}>
        <ul className={styles.list}>
          {
            clients.map(({ name, path }) => {
              return (
                <li key={path} className={styles.listItem}>
                  <button
                    className={styles.client}
                    onClick={() => handleClickClient(path)}
                  >
                    {name}
                  </button>
                </li>
              )
            })
          }
        </ul>
        {
          clientPath ? <EmailPartials clientPath={clientPath} base={base} /> : <></>
        }
      </main>
    </div>
  )
}