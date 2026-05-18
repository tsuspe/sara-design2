import * as React from 'react'
import { Input } from '@/components/ui/input'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  placeholder?: string
  disabled?: boolean
}

function clamp(n: number, min?: number, max?: number): number {
  let v = n
  if (typeof min === 'number' && v < min) v = min
  if (typeof max === 'number' && v > max) v = max
  return v
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  className,
  placeholder,
  disabled,
}: NumberInputProps) {
  const [local, setLocal] = React.useState<string>(String(value))
  const focused = React.useRef(false)

  React.useEffect(() => {
    if (!focused.current) setLocal(String(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setLocal(raw)
    if (raw === '' || raw === '-' || raw === '.' || raw === '-.') return
    const parsed = Number(raw)
    if (Number.isNaN(parsed)) return
    const clamped = clamp(parsed, min, max)
    if (clamped !== value) onChange(clamped)
  }

  const handleBlur = () => {
    focused.current = false
    const parsed = Number(local)
    if (local === '' || Number.isNaN(parsed)) {
      const fallback = typeof min === 'number' ? min : value
      setLocal(String(fallback))
      if (fallback !== value) onChange(fallback)
      return
    }
    const clamped = clamp(parsed, min, max)
    setLocal(String(clamped))
    if (clamped !== value) onChange(clamped)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    focused.current = true
    e.target.select()
  }

  return (
    <Input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*\.?[0-9]*"
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      min={min}
      max={max}
      step={step}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}
