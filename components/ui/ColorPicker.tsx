'use client'

interface Swatch {
  label: string
  value: string
}

interface ColorPickerProps {
  swatches: Swatch[]
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ swatches, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Accent color">
      {swatches.map((swatch) => (
        <button
          key={swatch.value}
          type="button"
          role="radio"
          aria-checked={value === swatch.value}
          aria-label={swatch.label}
          onClick={() => onChange(swatch.value)}
          className={`w-8 h-8 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
            value === swatch.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
          }`}
          style={{ backgroundColor: swatch.value }}
          title={swatch.label}
        />
      ))}
    </div>
  )
}
