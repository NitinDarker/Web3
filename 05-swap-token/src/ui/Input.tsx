import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  label?: string
  ref: React.Ref<HTMLInputElement>
}

export default function Input (props: InputProps) {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor='inpt' className='cursor-pointer pl-1 text-neutral-400'>{props.label}</label>
      <input
        className={`border border-neutral-700 bg-neutral-800 rounded-lg p-2 pl-3 text-sm w-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${props.className}`}
        type='text'
        id='inpt'
        placeholder={props.placeholder}
        ref={props.ref}
      />
    </div>
  )
}
