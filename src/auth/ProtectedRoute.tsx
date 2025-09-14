import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { type ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="p-8 text-center text-default-500">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
