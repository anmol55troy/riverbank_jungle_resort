import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'gold' | 'forest'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  const variants = {
    default: 'bg-cream text-espresso border border-espresso/15',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    warning: 'bg-amber-50 text-amber-800 border border-amber-300',
    info: 'bg-sky-50 text-sky-800 border border-sky-300',
    danger: 'bg-rose-50 text-rose-800 border border-rose-300',
    gold: 'bg-amber-100 text-amber-900 border border-amber-300',
    forest: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizes[size]} ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
