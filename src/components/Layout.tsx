import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'
import { Sun, Moon, SunHorizon, ArrowClockwise } from 'phosphor-react'
import { useAuth } from '../auth/AuthContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

export default function Layout() {
  const { cycleTheme, theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()

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
            {user ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly variant="light" className="rounded-full p-0 min-w-0 size-9">
                    <Avatar
                      as="span"
                      size="sm"
                      src={user.photoURL ?? undefined}
                      name={user.displayName ?? (user.email ?? 'User')}
                      className="ring-1 ring-default-200"
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User menu"
                  onAction={(key) => {
                    if (key === 'dashboard') navigate('/dashboard')
                    if (key === 'logout') void signOut(auth)
                  }}
                >
                  <DropdownItem key="header" isReadOnly className="h-14">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.displayName ?? 'Account'}</span>
                      <span className="text-xs text-default-500">{user.email}</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem key="dashboard">Dashboard</DropdownItem>
                  <DropdownItem key="logout" color="danger">Sign out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button as={Link} to="/login" color="primary">Login</Button>
            )}
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
