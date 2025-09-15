import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react'
import { Link, Outlet } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'
import { Sun, Moon, SunHorizon, ArrowClockwise } from 'phosphor-react'

export default function Layout() {
  const { cycleTheme, theme } = useTheme()
  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <Navbar maxWidth="xl">
        <NavbarBrand>
          <Link to="/" className="font-bold flex items-center gap-2">
            <ArrowClockwise size={18} />
            GenericApp
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              className="rounded-full size-9"
              onPress={cycleTheme}
            >
              {
                theme === 'dark'
                ? <Moon size={18} />
                : theme === 'light'
                ? <Sun size={18} />
                : <SunHorizon size={18} />
              }
            </Button>
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
