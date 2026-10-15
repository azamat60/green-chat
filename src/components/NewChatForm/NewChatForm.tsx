import { useState, type FormEvent } from 'react'
import { isValidPhone, normalizePhone } from '../../lib/chat'
import { CloseIcon } from '../icons'
import styles from './NewChatForm.module.css'

interface Props {
  onCreate: (phone: string) => Promise<void>
  onClose: () => void
}

export function NewChatForm({ onCreate, onClose }: Props) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const digits = normalizePhone(phone)
  const isValid = isValidPhone(digits)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValid || loading) return

    setLoading(true)
    setError(null)
    try {
      await onCreate(digits)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать чат')
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <span>Новый чат</span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          <CloseIcon width={18} height={18} />
        </button>
      </div>

      <div className={styles.row}>
        <input
          className={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          placeholder="+7 900 123-45-67"
          inputMode="tel"
          autoFocus
        />
        <button className={styles.submit} type="submit" disabled={!isValid || loading}>
          {loading ? '…' : 'Создать'}
        </button>
      </div>

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <p className={styles.hint}>Номер в международном формате, с кодом страны</p>
      )}
    </form>
  )
}
