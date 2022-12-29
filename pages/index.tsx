import Link from 'next/link'

import Loader from '../components/Loader'

export default function Home() {
  return (
    <main>
      <Loader show />
      <Link href="go!">Get er done!</Link>
    </main>
  )
}
