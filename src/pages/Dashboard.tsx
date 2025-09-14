import { Button } from '@heroui/react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-default-500">Only authenticated users can access this page.</p>
      <Button color="danger" onPress={() => signOut(auth)}>Sign out</Button>
    </div>
  )
}
