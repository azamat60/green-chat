import type { MessageStatus } from '../../types'
import { AlertIcon, CheckIcon, ClockIcon, DoubleCheckIcon } from '../icons'
import styles from './MessageList.module.css'

export function StatusIcon({ status }: { status?: MessageStatus }) {
  switch (status) {
    case 'pending':
      return <ClockIcon width={14} height={14} />
    case 'sent':
      return <CheckIcon width={14} height={14} />
    case 'delivered':
      return <DoubleCheckIcon width={18} height={14} />
    case 'read':
      return <DoubleCheckIcon width={18} height={14} className={styles.read} />
    case 'failed':
      return <AlertIcon width={14} height={14} className={styles.failed} />
    default:
      return null
  }
}
