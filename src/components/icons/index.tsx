import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const SendIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h13M12 5l7 7-7 7" />
  </svg>
)

export const PlusIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const LogoutIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11" />
  </svg>
)

export const BackIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const CheckIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 16 16" strokeWidth={1.6} {...props}>
    <path d="M2.5 8.5l3 3 6-7" />
  </svg>
)

export const DoubleCheckIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 20 16" strokeWidth={1.6} {...props}>
    <path d="M1.5 8.5l3 3 6-7M9 11.5l.5.5 6.5-7.5" />
  </svg>
)

export const ClockIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 16 16" strokeWidth={1.4} {...props}>
    <circle cx="8" cy="8" r="5.5" />
    <path d="M8 5v3l2 1.5" />
  </svg>
)

export const AlertIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 16 16" strokeWidth={1.4} {...props}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v3.5M8 11h.01" />
  </svg>
)
