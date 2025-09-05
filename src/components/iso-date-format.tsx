// iso-date-format.tsx
'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'

type Props = {
  name?: string
  label?: string
  value?: string                    // optional controlled value
  defaultValue?: string             // optional uncontrolled start value
  onValueChange?: (v: string) => void
  className?: string                // forwarded to <Input>
}

const ISO_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

export function isIsoDateStrict(s: string): boolean {
  if (!ISO_REGEX.test(s)) return false
  const [y, m, d] = s.split('-').map(Number)
  const dt = new Date(y, m - 1, d) // avoids timezone pitfalls
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

export default function IsoDateField({
  name = 'date',
  label = 'date (YYYY-MM-DD)',
  value,
  defaultValue,
  onValueChange,
  className,
}: Props) {
  const [inner, setInner] = React.useState<string>(defaultValue ?? '')
  const current = value ?? inner

  const valid = isIsoDateStrict(current)
  const humanized = valid
    ? (() => {
        const [y, m, d] = current.split('-').map(Number)
        return new Date(y, m - 1, d).toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      })()
    : ''

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    onValueChange?.(next)
    if (value === undefined) setInner(next)
  }

  return (
    <div className="space-y-1 min-w-0">
      <div className="text-[11px] font-medium opacity-70 truncate">{label}</div>
      <Input
        name={name}
        type="text"
        inputMode="numeric"
        placeholder="YYYY-MM-DD"
        value={current}
        onChange={handleChange}
        pattern="\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])"
        title="Use YYYY-MM-DD format, e.g., 2020-12-12"
        autoComplete="off"
        className={['text-center h-9', className].filter(Boolean).join(' ')}
      />
      <div className="text-[11px] opacity-70 h-4">{humanized || 'Format: YYYY-MM-DD'}</div>
    </div>
  )
}
