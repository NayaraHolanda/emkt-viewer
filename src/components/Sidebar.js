import { useEffect, useState } from "react"
import axios from "axios"
import db from "../../db.json"
import styles from '../styles/components/Sidebar.module.css'
import Email from "./Email"

export default function Sidebar() {

  const [list, setList] = useState([])
  const [html, setHtml] = useState(null)
  const [pathHtml, setPathHtml] = useState(null)

  useEffect(() => {
    axios.post('/api/git', {path: db.basePath}).then(({ data }) => {
      setList(data.list)
    })
  }, [])

  const slugify = /\/|\s|\.|&|\(|\)|'/g

  async function requestFiles(path, type = 'dir') {
    let _data = null
    await axios.post('/api/git', { path, type }).then(({ data }) => {
      _data = data
    })

    return _data
  }

  async function handleOnClickFile({ path, type, list }) {
    if (type === 'dir') {
      if (!list.length) {
        const data = await requestFiles(path)
        const list = checkImagesFolder(data.list)
        updateList(path, list)
      }
    } else {
      const downloadUrl = await requestFiles(path, 'file')
      axios.post('/api/email', { email: downloadUrl }).then(({data}) => {
        replaceStaticImages(path, data)
        setPathHtml(path)
      })
    }
  }

  function checkImagesFolder(subList){
    let foundHtml = false
    let foundImageFolder = false
    let imageFolder = []

    subList.forEach((item) => {
      if (item.name.includes('.html')) {
        foundHtml = true
      }

      if (item.type === 'dir') {
        foundImageFolder = true
        imageFolder = item
      }
    })

    foundHtml && foundImageFolder ? subList = subList.filter((item) => item.name !== imageFolder.name) : subList

    return subList
  }

  async function replaceStaticImages(path, email) {
    const foundStaticImagesRegExp = /src="(?!http)[^"]+"/
    const foundStaticImages = email.match(foundStaticImagesRegExp)

    if (foundStaticImages) {
      let _path = path.split('/').slice(0, -1).join('/')
      let data = await requestFiles(_path)

      const imageFolder = data.list.find((item) => item.type === 'dir').name

      _path = (`${_path}/${imageFolder}`)
      data = await requestFiles(_path)

      const images = data.list

      images.forEach((image) => {
        const imageRegExp = new RegExp(`src=".*\/${image.name}"`, 'g')
        const imageUrl = `src="${image.downloadUrl}"`

        email = email.replace(imageRegExp, imageUrl)
      })
    }
    setHtml(email)
  }

  function updateList(path, subList) {
    const _list = list
    const folders = path.split('/').splice(1)
    let item = _list
    let folderName = ''

    folders.forEach((folder) => {
      if (!Array.isArray(item)) {
        item = item.list
      }
      folderName += `/${folder}`
      item = item.find((_item) => _item.path === `${db.basePath}${folderName}`)
    })

    item.list = subList
    setList([..._list])
  }

  function createList(list) {
    return list.map((item, index) => {
      return (
        item.type === 'dir' ?
        <ul key={`${index}-${item.path}`} className={styles.mainList}>
          <li>
            <button
              type="button"
              aria-expanded="false"
              data-bs-placement="right"
              data-bs-target={`#${item.path.replaceAll(slugify, '-')}`}
              data-bs-toggle="collapse"
              title={item.name}
              className={styles.btn}
              onClick={() => handleOnClickFile(item)}
            >
              <span className={styles.ellipsis}>{item.name}</span>
            </button>
            <ul className={`collapse ${styles.list}`} id={item.path.replaceAll(slugify, '-')}>
              <li>
                {item.list && item.list.length ? createList(item.list) : ''}
              </li>
            </ul>
          </li>
        </ul>
        :
        <ul key={`${index}-${item.path}`} className={styles.mainList}>
          <li>
            <button
              onClick={() => handleOnClickFile(item)}
              data-bs-placement="right"
              title={item.name}
              className={styles.file}
              key={`${index}-${item.path}`}
            >
              {item.name}
            </button>
            {item.list && item.list.length ? createList(item.list) : ''}
          </li>
        </ul>
      )
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div>
          { createList(list) }
        </div>
        {/* <div className={styles.divider}></div> */}
      </div>
      <Email path={pathHtml} email={html} />
    </div>
  )
}