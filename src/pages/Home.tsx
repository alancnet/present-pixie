import { Button } from '@heroui/react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Present Pixie</h1>
        <p className="text-default-500 text-lg md:text-xl">
          Personalized gift ideas for any occasion. Start without an account.
        </p>
        <div className="flex gap-3 justify-center">
          <Button as={Link} to="/dashboard" color="primary">Find Gifts</Button>
          <Button as={Link} to="/contact" variant="bordered">Contact</Button>
        </div>
      </div>
    </section>
  )
}
