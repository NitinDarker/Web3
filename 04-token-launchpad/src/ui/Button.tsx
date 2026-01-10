import type { ReactNode } from 'react'

type VariantType = 'primary' | 'secondary'

interface ButtonProps {
  onClick: () => void | Promise<void>
  children: ReactNode
  className?: string
  variant?: VariantType
  loading?: boolean
  disabled?: boolean
}

const variants: Record<VariantType, string> = {
  primary:
    'text-white px-10 py-2 text-base font-semibold bg-violet-600 hover:bg-violet-500 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30',
  secondary: 'text-sm w-25 h-8 border border-neutral-700 hover:bg-neutral-700'
}

export default function Button ({
  onClick,
  className = '',
  children,
  variant = 'primary',
  loading = false,
  disabled = false
}: ButtonProps) {
  const isDisabled = loading || disabled

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`rounded-lg transition-all duration-500 ${
        variants[variant]
      } ${className} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
