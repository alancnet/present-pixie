import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'

export default function Home() {
  const { cycleTheme } = useTheme()
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar maxWidth="xl">
        <NavbarBrand>
          <Link to="/" className="font-bold">GenericApp</Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button variant="light" onPress={cycleTheme}>Theme</Button>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} to="/login" color="primary">Login</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className="px-6 md:px-10 py-16 md:py-24">
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Build faster with HeroUI</h1>
          <p className="text-default-500 text-lg md:text-xl">
            A modern, responsive app scaffold with Firebase auth & Tailwind v4.
          </p>
          <div className="flex gap-3 justify-center">
            <Button as={Link} to="/dashboard" color="primary">Go to Dashboard</Button>
            <Button as={Link} to="/contact" variant="bordered">Contact Us</Button>
          </div>
        </section>
      </main>
    </div>
  )
}
