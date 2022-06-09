import Image from 'next/image'
import Link from 'next/link'
import styles from "../styles/components/Navbar.module.css"

export default function Navbar() {
  return (
    <header className={styles.mainHeader}>
      <nav>
        <ul>
          <li className={styles.link}>
            <Link href="/">Library</Link>
          </li>
          <li className={styles.link}>
            <Link href="/builder">Builder</Link>
          </li>
        </ul>
      </nav>
      <Image src="/logo.png" alt="A Madre" layout="fill" className={styles.image} priority />
    </header>
  )
}

