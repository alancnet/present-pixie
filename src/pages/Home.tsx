import { Button } from '@heroui/react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, signInAnonymously } from '../firebase'
import { useState } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const startAnon = async () => {
    try {
      setLoading(true)
      await signInAnonymously(auth)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Present Pixie</h1>
        <p className="text-default-500 text-lg md:text-xl">Personalized gift discovery and reminders.</p>
        <div className="flex gap-3 justify-center">
          <Button color="primary" isLoading={loading} onPress={startAnon}>Start without an account</Button>
          <Button as={Link} to="/contact" variant="bordered">Contact Us</Button>
        </div>
      </div>
    </section>
  )
}
