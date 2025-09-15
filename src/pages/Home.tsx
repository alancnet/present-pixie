import { Button } from '@heroui/react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Build faster with HeroUI</h1>
        <p className="text-default-500 text-lg md:text-xl">
          A modern, responsive app scaffold with Firebase auth & Tailwind v4.
        </p>
        <div className="flex gap-3 justify-center">
          <Button as={Link} to="/dashboard" color="primary">Go to Dashboard</Button>
          <Button as={Link} to="/contact" variant="bordered">Contact Us</Button>
        </div>
      </div>
    </section>
  )
}
