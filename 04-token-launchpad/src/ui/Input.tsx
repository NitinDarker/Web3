import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  ref?: React.Ref<HTMLInputElement>
}

export default function Input (props: InputProps) {
  return (
    <input
      className='border border-neutral-600 rounded-lg p-1 pl-2 text-sm w-lg'
      type='text'
      placeholder={props.placeholder}
      ref={props.ref}
    />
  )
}