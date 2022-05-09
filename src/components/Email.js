import React, { useEffect, useState } from "react"
import styles from '../styles/components/Email.module.css'
import hljs from "highlight.js"

export default function Email({ path, email }){
  const [showCodeEmailButton, setShowCodeEmailButton] = useState('Show code')
  const [copyButton, setCopyButton] = useState('Copy')
  const [frameWidth, setFrameWidth] = useState('100%')
  const [developmentTime, setDevelopmentTime] = useState(null)

  useEffect(() => {
    if (isCodeView()) {
      hljs.highlightAll()
    }
  })

  useEffect(() => {
    if (email) {
      const regExp = /(?<=<!--\s*Time:\s*)\d+(?=\s*-->)/ig
      let checkDevelopmentTime = email.match(regExp)
      checkDevelopmentTime ? setDevelopmentTime(checkDevelopmentTime[0]) : setDevelopmentTime(null)
      console.log(developmentTime);
    }
  }, [email, developmentTime])

  function isCodeView () {
    return showCodeEmailButton === 'Show email'
  }

  function handleClickShowButton() {
    isCodeView() ? setShowCodeEmailButton('Show code') : setShowCodeEmailButton('Show email')
  }

  function handleClickCopyButton() {
    setCopyButton('Copied!')
    navigator.clipboard.writeText(email)
    setTimeout(() => {
      setCopyButton('Copy')
    }, "5000")
  }

  function handleClickDesktopWidth() {
    setFrameWidth('100%')
  }

  function handleClickMobileWidth() {
    setFrameWidth(480)
  }

  return (
    email ?
      <div className={styles.container}>
        <div className={styles.tools}>
          <div className={styles.toolsButton}>
            {
              developmentTime ?
                <div
                  data-bs-placement="left"
                  title="Development Time"
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled
                  >
                    { developmentTime } minutes
                  </button>
                </div>
              :
              <></>
            }
            <button
              type="button"
              onClick={handleClickShowButton}
              className="btn btn-outline-dark btn-sm"
            >
              { showCodeEmailButton }
            </button>
            { !isCodeView() ?
              <div>
                <button
                type="button"
                className="btn btn-light"
                onClick={handleClickDesktopWidth}
                data-bs-toggle="button"
                autoComplete="off"
                aria-pressed="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pc-display-horizontal" viewBox="0 0 16 16">
                    <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0h-13Zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5ZM12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0ZM1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1ZM1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25Z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="btn btn-light"
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
                style={{cursor: 'copy'}}
              >
                { copyButton }
              </button>
            }
          </div>
          <span>{ path }</span>
        </div>
        <div className={styles.email}>
          { isCodeView() ?
            <div className={styles.code}>
              <pre>
               <code className="language-html">{ email }</code>
              </pre>
            </div>
            :
            <div style={{width: frameWidth}}>
              <iframe srcDoc={email} frameBorder="0" width="100%" height="100%" />
            </div>
          }
        </div>
      </div>
    : <></>
  )
}