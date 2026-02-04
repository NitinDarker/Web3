import { useState } from 'react'

interface dropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export default function Dropdown (props: dropdownProps) {
  const [val, setVal] = useState('en')

  function handleChange (e: any) {
    setVal(e.target.value)
  }

  return (
    <select
      value={val}
      onChange={handleChange}
      className={`bg-neutral-800 border border-neutral-600 rounded-2xl w-20 px-2 py-1 ${props.className}`}
    >
      <option value='en'>SOL</option>
      <option value='hi'>USDC</option>
      <option value='fr'>USDT</option>
    </select>
  )
}
