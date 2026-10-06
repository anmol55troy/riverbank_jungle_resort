'use client'

import React, { useState } from 'react'
import { Button } from '../ui/Button'

export interface FeatureItem {
  label: string
  value: string
  id?: string | null
}

export interface FeaturesArrayProps {
  name: string
  defaultValue?: FeatureItem[] | null
}

export function FeaturesArray({ name, defaultValue = [] }: FeaturesArrayProps) {
  const [features, setFeatures] = useState<FeatureItem[]>(
    defaultValue && defaultValue.length > 0
      ? defaultValue
      : [{ label: '', value: '', id: Math.random().toString(36).substring(2, 9) }]
  )

  const handleAdd = () => {
    setFeatures((prev) => [...prev, { label: '', value: '', id: Math.random().toString(36).substring(2, 9) }])
  }

  const handleRemove = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: 'label' | 'value', val: string) => {
    setFeatures((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: val }
      return copy
    })
  }

  return (
    <div className="space-y-2">
      {/* Hidden input storing the JSON array */}
      <input type="hidden" name={name} value={JSON.stringify(features.filter((f) => f.label.trim() || f.value.trim()))} />

      <div className="space-y-2">
        {features.map((feat, idx) => (
          <div key={feat.id || idx} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Label (e.g. Size, Occupancy)"
              value={feat.label}
              onChange={(e) => handleChange(idx, 'label', e.target.value)}
              className="flex-1 rounded-lg border border-espresso/20 px-3 py-1.5 text-xs text-espresso bg-white"
            />
            <input
              type="text"
              placeholder="Value (e.g. 378 sq.ft, 2 Adults)"
              value={feat.value}
              onChange={(e) => handleChange(idx, 'value', e.target.value)}
              className="flex-1 rounded-lg border border-espresso/20 px-3 py-1.5 text-xs text-espresso bg-white"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-1.5 text-espresso/40 hover:text-rose-600 transition-colors cursor-pointer"
              title="Delete feature"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
        + Add Feature
      </Button>
    </div>
  )
}
