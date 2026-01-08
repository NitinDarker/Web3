import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const TOAST_DURATION = 3000

export function useToast () {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider ({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, TOAST_DURATION)
  }, [])

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500'
      case 'error':
        return 'bg-red-600 border-red-500'
      default:
        return 'bg-neutral-700 border-neutral-600'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className='fixed bottom-4 right-4 flex flex-col gap-2 z-50'>
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`px-4 py-3 rounded-lg border text-white text-sm shadow-lg cursor-pointer
              transition-all duration-300 animate-slide-in hover:scale-105
              ${getToastStyles(toast.type)}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
