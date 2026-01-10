import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  ref?: React.Ref<HTMLInputElement>
}

export default function Input ({
  ref,
  className,
  type = 'text',
  label,
  ...props
}: InputProps) {
  return (
    <div className='flex flex-col flex-1'>
      <label className='text-sm text-neutral-400 mb-1'>
        {label}
        <input
          className={`
            border rounded-lg p-2 pl-3 text-sm w-full mt-1
            bg-neutral-800 text-neutral-100 placeholder-neutral-500
            hover:border-neutral-600
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            border-neutral-700 focus:ring-violet-500
            ${className ?? ''}
          `}
          type={type}
          ref={ref}
          {...props}
        />
      </label>
    </div>
  )
}
