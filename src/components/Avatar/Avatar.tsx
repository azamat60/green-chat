import styles from './Avatar.module.css'
import { DEFAULT_AVATAR_SIZE } from './constants'
import { getInitials, pickPalette } from './utils'

interface Props {
  seed: string
  name: string
  size?: number
}

export function Avatar({ seed, name, size = DEFAULT_AVATAR_SIZE }: Props) {
  const [from, to] = pickPalette(seed)

  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {getInitials(name)}
    </div>
  )
}
