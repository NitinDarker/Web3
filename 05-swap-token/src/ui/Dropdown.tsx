interface dropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  setValue: any
}

export default function Dropdown (props: dropdownProps) {
  function handleChange (e: any) {
    props.setValue(e.target.value)
  }

  return (
    <select
      value={props.value}
      onChange={handleChange}
      className={`bg-neutral-800 border border-neutral-600 rounded-2xl w-20 px-2 py-1 ${props.className}`}
    >
      <option value='SOL'>SOL</option>
      <option value='USDC'>USDC</option>
      <option value='USDT'>USDT</option>
    </select>
  )
}
