import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider'
import { AuthProvider } from './auth/AuthContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'

import Home from './pages/Home.tsx'
import Privacy from './pages/Privacy.tsx'
import Terms from './pages/Terms.tsx'
import Contact from './pages/Contact.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Login from './pages/Login.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/contact', element: <Contact /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
