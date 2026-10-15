import { useState, type FormEvent } from 'react'
import { checkAuthorization, getDefaultApiUrl } from '../../api/greenApi'
import type { Credentials } from '../../types'
import styles from './LoginScreen.module.css'

interface Props {
  onLogin: (credentials: Credentials) => void
}

export function LoginScreen({ onLogin }: Props) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [apiUrlTouched, setApiUrlTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const resolvedApiUrl = apiUrlTouched ? apiUrl : getDefaultApiUrl(idInstance)
  const canSubmit = Boolean(idInstance && apiTokenInstance && resolvedApiUrl) && !loading

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    const credentials = { idInstance, apiTokenInstance, apiUrl: resolvedApiUrl }
    setLoading(true)
    setError(null)

    try {
      await checkAuthorization(credentials)
      onLogin(credentials)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.logo}>G</div>
        <h1 className={styles.title}>Вход в чат</h1>
        <p className={styles.subtitle}>
          Данные инстанса из личного кабинета <span className={styles.nowrap}>GREEN-API</span>
        </p>

        <label className={styles.field}>
          <span>idInstance</span>
          <input
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="4100000000"
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span>apiTokenInstance</span>
          <input
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value.trim())}
            type="password"
            autoComplete="off"
          />
        </label>

        <label className={styles.field}>
          <span>apiUrl</span>
          <input
            value={resolvedApiUrl}
            onChange={(e) => {
              setApiUrlTouched(true)
              setApiUrl(e.target.value)
            }}
            placeholder="https://4100.api.green-api.com"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submit} type="submit" disabled={!canSubmit}>
          {loading ? 'Проверяем…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
