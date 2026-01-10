import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function Modal ({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
1
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      onClick={onClose}
    >
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
      <div
        className='relative bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl shadow-black/50 max-w-md w-full mx-4 animate-fade-out'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-4 border-b border-neutral-800'>
          <h2 className='text-lg font-bold text-neutral-100'>
            {title || 'Modal'}
          </h2>
          <button
            onClick={onClose}
            className='text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer text-2xl leading-none'
          >
            &times;
          </button>
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  )
}
