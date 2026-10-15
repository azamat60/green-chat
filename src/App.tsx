import { useState } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { Messenger } from './components/Messenger'
import { clearCredentials, loadCredentials, saveCredentials } from './lib/storage'
import type { Credentials } from './types'

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(loadCredentials)

  function handleLogin(next: Credentials) {
    saveCredentials(next)
    setCredentials(next)
  }

  function handleLogout() {
    clearCredentials()
    setCredentials(null)
  }

  if (!credentials) return <LoginScreen onLogin={handleLogin} />

  return <Messenger key={credentials.idInstance} credentials={credentials} onLogout={handleLogout} />
}
