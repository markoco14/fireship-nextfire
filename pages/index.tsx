import Link from 'next/link'
import { toast } from 'react-hot-toast'

import Loader from '../components/Loader'

export default function Home() {
  return (
    <main>
      <button onClick={() => toast.success('hello toast!')}>
        Toast Me
      </button>
    </main>
  )
}
