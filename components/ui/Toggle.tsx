'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          checked ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
}
