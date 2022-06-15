import axios from 'axios'
import { useState, useEffect } from 'react'
import styles from '../styles/components/EmailPartials.module.css'

interface EmailPartialsProps {
  clientPath: string
  base: string
}

export default function EmailPartials(props: EmailPartialsProps) {
  const [header, setHeader] = useState([])
  const [body, setBody] = useState([])
  const [footer, setFooter] = useState([])

  const partials = [
    { name: 'header', setState: setHeader },
    { name: 'body', setState: setBody },
    { name: 'footer', setState: setFooter },
  ]

  const baseRegExp = /<!-- CONTENT -->/g

  useEffect(() => {
    partials.map(({ name, setState }) => {
      axios.post('/api/git', { path: `${props.clientPath}/${name}` })
        .then(({ data }) => {
          data.list.map((item) => {
            axios.post('/api/email', { email: item.downloadUrl })
              .then(({ data }) => {
                item.html = data
                const htmlComplete = props.base.replace(baseRegExp, data)
                item.htmlComplete = htmlComplete
                setState(oldArray => [...oldArray, item])
              })
          })
        })
    })
  }, [props.clientPath])

  function showPartials(partial) {
    return partial.map(({ name, path, htmlComplete }) => {
      return (
        <div key={path} style={{ width: '617px' }}>
          <p>
            {name.split('.html')}
          </p>
          <button>
            Selecionar
          </button>
          <iframe srcDoc={htmlComplete} frameBorder="0" width="100%" height="100%" style={{ display: 'block' }} />
        </div>
      )
    })
  }

  return (
    <div>
      {header ? <p>HEADER</p> : <></>}
      {showPartials(header)}
      {body ? <p>BODY</p> : <></>}
      {showPartials(body)}
      {footer ? <p>FOOTER</p> : <></>}
      {showPartials(footer)}
    </div>
  )
}