import React from 'react'

const getBaseInputClasses = (error?: boolean, className = '') => {
  return `w-full rounded-lg bg-white px-3.5 py-2 text-sm text-espresso border transition-colors focus:outline-none focus:ring-2 focus:ring-espresso/20 ${
    error
      ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-200'
      : 'border-espresso/20 focus:border-espresso'
  } ${className}`.trim()
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function TextInput({ error, className = '', ...props }: InputProps) {
  return (
    <input
      type="text"
      className={getBaseInputClasses(error, className)}
      {...props}
    />
  )
}

export function NumberInput({ error, className = '', ...props }: InputProps) {
  return (
    <input
      type="number"
      className={getBaseInputClasses(error, className)}
      {...props}
    />
  )
}

export function DateInput({ error, className = '', ...props }: InputProps) {
  return (
    <input
      type="date"
      className={getBaseInputClasses(error, className)}
      {...props}
    />
  )
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className = '', rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={getBaseInputClasses(error, className)}
      {...props}
    />
  )
}

interface SelectOption {
  label: string
  value: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  error?: boolean
}

export function Select({ options, error, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`${getBaseInputClasses(error, className)} cursor-pointer`.trim()}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Checkbox({ label, className = '', id, ...props }: CheckboxProps) {
  const inputId = id || props.name || Math.random().toString(36).substring(7)
  return (
    <label htmlFor={inputId} className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-espresso">
      <input
        type="checkbox"
        id={inputId}
        className={`rounded border-espresso/30 text-espresso focus:ring-espresso/20 h-4 w-4 transition-colors ${className}`.trim()}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  )
}
