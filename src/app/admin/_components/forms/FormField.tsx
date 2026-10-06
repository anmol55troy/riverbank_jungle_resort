import React from 'react'

export interface FormFieldProps {
  label: string
  name?: string
  required?: boolean
  description?: string
  error?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  name,
  required = false,
  description,
  error,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`.trim()}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-espresso/80">
          {label}
          {required && <span className="text-rose-600 ml-1">*</span>}
        </label>
      </div>
      {children}
      {description && !error && <p className="text-xs text-espresso/60">{description}</p>}
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  )
}
