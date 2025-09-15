import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react'
import { Link, Outlet } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'

export default function Layout() {
  const { cycleTheme } = useTheme()
  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
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
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="px-6 md:px-10 py-6 text-center text-sm text-default-500">
        © {new Date().getFullYear()} GenericApp. All rights reserved.
      </footer>
    </div>
  )
}
