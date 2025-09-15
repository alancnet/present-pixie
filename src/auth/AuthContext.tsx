import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    // Ensure anonymous auth for no-account use
    if (!auth.currentUser) {
      void signInAnonymously(auth).catch(() => {
        // Ignore; UI will still function without user state if config is missing
      })
    }
    return () => unsub()
  }, [])

  const value = useMemo(() => ({ user, loading }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
