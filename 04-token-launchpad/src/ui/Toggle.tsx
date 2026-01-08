interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function Toggle ({
  label,
  description,
  checked,
  onChange
}: ToggleProps) {
  return (
    <div className='flex flex-1 items-center justify-between'>
      <div>
        <p className='text-sm font-medium text-neutral-100'>{label}</p>
        {description && (
          <p className='text-xs text-neutral-400'>{description}</p>
        )}
      </div>
      <button
        type='button'
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-violet-600' : 'bg-neutral-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
