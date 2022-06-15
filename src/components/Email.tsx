import axios from 'axios'
import emailonacid from '../../../.credentials/emailonacid.json'
import hljs from 'highlight.js'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/components/Email.module.css'

interface EmailProps {
  path: string
  email: string
  visibleAreaSize: number
  isResizing: boolean
}

export default function Email(props: EmailProps) {
  const [copyButton, setCopyButton] = useState('Copy')
  const [developmentTime, setDevelopmentTime] = useState(null)
  const [emailFixed, setEmailFixed] = useState(null)
  const [frameWidth, setFrameWidth] = useState('100%')
  const [showCodeEmailButton, setShowCodeEmailButton] = useState('Show code')
  const pathFixed = props.path?.replace('clients/', '').replaceAll('/', ' > ')
  const iframePointerEvents = useRef(null)

  useEffect(() => {
    iframePointerEvents.current = document.getElementById('mainFrame')

    if (iframePointerEvents.current !== null) {
      if (props.isResizing) {
        iframePointerEvents.current.style.pointerEvents = 'none'
      } else {
        iframePointerEvents.current.style.pointerEvents = 'auto'
      }
    }
  }, [props.isResizing])

  useEffect(() => {
    if (isCodeView()) {
      hljs.highlightAll()
    }
  })

  useEffect(() => {
    if (props.email) {
      const regExp = /(?<=<!--\s*Time:\s*)\d+(?=\s*-->)/ig
      const checkDevelopmentTime = props.email.match(regExp)
      checkDevelopmentTime ? setDevelopmentTime(checkDevelopmentTime[0]) : setDevelopmentTime(null)
    }
  }, [props.email, developmentTime])

  useEffect(() => {
    if (props.email) {
      const regExp = /@media\s+only\s+screen\s+and\s+\(\s*max-device-width\s*:\s*480px\s*\)\s*,\s*only\s+screen\s+and\s+\(\s*max-width\s*:\s*480px\s*\)/
      const newWidth = '@media only screen and (max-device-width: 497px), only screen and (max-width: 497px)'
      const emailNewWidth = props.email.replace(regExp, newWidth)
      setEmailFixed(emailNewWidth)
    }
  }, [props.email, emailFixed])

  const headers = {
    Authorization: `Basic ${emailonacid.auth}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  function handleClickTestButton() {
    let botaoOnAcid = document.getElementById('botaoEmailOnAcid')
    const pathSplit = props.path.split('/')
    const client = pathSplit[2]
    const filename = pathSplit.pop().split('.')[0]
    const body = {
      'subject': `${client} | ${filename}`,
      'html': props.email
    }

    axios.post('https://api.emailonacid.com/v5/email/tests', body, { headers })
      .then(function (res) {
        window.open(
          `https://app.emailonacid.com/app/acidtest/${res.data.id}/list`,
          '_blank'
        )
      })
      .catch(function (error) {
        console.error(error)
      })
  }


  function handleClickShowButton() {
    let botao1 = document.getElementById('botao1')
    botao1.classList.toggle(styles.darkmode)
    isCodeView() ? setShowCodeEmailButton('Show code') : setShowCodeEmailButton('Show email')
  }

  function isCodeView() {
    return showCodeEmailButton === 'Show email'
  }

  function handleClickDesktopWidth() {
    let botao2 = document.getElementById('botao2')
    let botao3 = document.getElementById('botao3')
    botao2.addEventListener('mouseout', function () {
      botao2.style.background = '#ffffff'
      botao2.style.color = '#18c1d8'
    })
    botao2.addEventListener('mousemove', function () {
      botao2.style.background = '#ffffff'
      botao2.style.color = '#18c1d8'
    })
    botao3.addEventListener('mousemove', function () {
      botao3.style.background = '#f0e9e9'
      botao3.style.color = '#000000'
    })
    botao3.addEventListener('mouseout', function () {
      botao3.style.background = '#ffffff'
      botao3.style.color = '#cccccc'
    })
    botao2.style.color = '#18c1d8'
    botao3.style.color = '#cccccc'
    setFrameWidth('100%')
  }

  function handleClickMobileWidth() {
    let botao3 = document.getElementById('botao3')
    let botao2 = document.getElementById('botao2')
    botao2.addEventListener('mousemove', function () {
      botao2.style.background = '#f0e9e9'
      botao2.style.color = '#000000'
    })
    botao3.addEventListener('mousemove', function () {
      botao3.style.background = '#ffffff'
      botao3.style.color = '#18c1d8'
    })
    botao2.addEventListener('mouseout', function () {
      botao2.style.background = '#ffffff'
      botao2.style.color = '#cccccc'
    })
    botao3.addEventListener('mouseout', function () {
      botao3.style.background = '#ffffff'
      botao3.style.color = '#18c1d8'
    })

    botao3.style.color = '#18c1d8'
    botao2.style.color = '#cccccc'
    setFrameWidth('497px')
  }

  function handleClickCopyButton() {
    setCopyButton('Copied!')
    navigator.clipboard.writeText(props.email)
    setTimeout(() => {
      setCopyButton('Copy')
    }, 5000)
  }

  return (
    props.email ?
      <div
        className={styles.container}
        style={{ width: `calc(100% - ${props.visibleAreaSize}px - 5px)` }}
      >
        <div className={styles.tools}>
          <div className={styles.toolsButton}>
            {
              developmentTime ?
                <div
                  title="Development Time"
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled
                  >
                    {developmentTime} minutes
                  </button>
                </div>
                :
                <></>
            }
            <button
              id="botaoEmailOnAcid"
              className={styles.botaoAcid}
              type="button"
              onClick={handleClickTestButton}
              //className="btn btn-secondary btn-sm"
              title="See tests"
            >
              Email on acid
            </button>
            <button
              id="botao1"
              className={styles.botao}
              type="button"
              onClick={handleClickShowButton}
            //className="btn btn-outline-dark btn-sm"
            >
              {showCodeEmailButton}
            </button>
            {!isCodeView() ?
              <div>
                <button
                  id="botao2"
                  className={styles.botaoDesktop}
                  type="button"
                  //className="btn btn-light"
                  onClick={handleClickDesktopWidth}
                //data-bs-toggle="button"
                //autoComplete="off"
                //aria-pressed="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pc-display-horizontal" viewBox="0 0 16 16">
                    <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0h-13Zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5ZM12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0ZM1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1ZM1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25Z" />
                  </svg>
                </button>
                <button
                  id="botao3"
                  className={styles.botaoMobile}
                  type="button"
                  //className="btn btn-light"
                  onClick={handleClickMobileWidth}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone" viewBox="0 0 16 16">
                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  </svg>
                </button>
              </div>
              :
              <button
                type="button"
                onClick={handleClickCopyButton}
                className="btn btn-light btn-sm"
                style={{ cursor: 'copy' }}
              >
                {copyButton}
              </button>
            }
          </div>
          <span title={pathFixed}>{pathFixed}</span>
        </div>
        <div className={styles.email}>
          {isCodeView() ?
            <pre className={styles.code}>
              <code className="language-html">{props.email}</code>
            </pre>
            :
            <div style={{ width: frameWidth }}>
              <iframe id="mainFrame" srcDoc={emailFixed} frameBorder="0" width="100%" height="100%" style={{ display: 'block' }} />
            </div>
          }
        </div>
      </div>
      : <></>
  )
}