import React from 'react'

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  ref?: React.Ref<HTMLTextAreaElement>
}

export default function Textarea ({
  ref,
  className,
  label,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <div className='flex flex-col flex-1'>
      <label className='text-sm text-neutral-400 mb-1 cursor-pointer'>
        {label}
        <textarea
          className={`
            border rounded-lg p-2 pl-3 text-sm w-full mt-1 resize-none
            bg-neutral-800 text-neutral-100 placeholder-neutral-500
            hover:border-neutral-600
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            border-neutral-700 focus:ring-violet-500
            ${className ?? ''}
          `}
          rows={rows}
          ref={ref}
          {...props}
        />
      </label>
    </div>
  )
}
