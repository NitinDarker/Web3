import type { ReactNode } from 'react'

type VariantType = 'primary' | 'secondary'

interface ButtonProps {
  onClick: () => void
  children: ReactNode
  className?: string
  variant?: VariantType
}

const variants: Record<VariantType, string> = {
  primary: 'w-lg text-white p-1 bg-violet-800 hover:scale-105',
  secondary: 'text-sm w-25 h-8 border-2 border-neutral-600 hover:bg-neutral-600'
}

export default function Button ({
  onClick,
  className = '',
  children,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg cursor-pointer transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
