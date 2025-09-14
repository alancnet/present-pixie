import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react'
import { type FormEvent, useState } from 'react'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/dashboard'

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e?.message ?? 'Google sign-in failed')
    }
  }

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e?.message ?? 'Email sign-in failed')
    }
  }

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed')
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-default-500">Use Google or email/password</p>
        </CardHeader>
        <CardBody className="space-y-4">
          {error && <div className="text-danger text-sm">{error}</div>}
          <Button color="primary" onPress={handleGoogle} fullWidth>
            Continue with Google
          </Button>
          <form onSubmit={handleEmail} className="space-y-3">
            <Input type="email" label="Email" value={email} onValueChange={setEmail} required />
            <Input type="password" label="Password" value={password} onValueChange={setPassword} required />
            <Button type="submit" color="secondary" fullWidth>
              Sign in with Email
            </Button>
          </form>
          <Button variant="bordered" onPress={handleRegister} fullWidth>
            Create account
          </Button>
          <div className="text-center text-sm text-default-500">
            <Link to="/">Back home</Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
