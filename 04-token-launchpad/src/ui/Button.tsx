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
  primary: 'w-lg text-white p-1.5 bg-violet-800 hover:scale-105',
  secondary: 'text-sm w-25 h-8 border-2 border-neutral-600 hover:bg-neutral-600'
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
      className={`rounded-lg transition-all duration-300 ${variants[variant]} ${className} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}