'use client'

import { useState } from 'react'

interface IconSelectorProps {
  value: string
  onChange: (icon: string) => void
  label?: string
}

const ICONS = [
  { value: 'fa-home', label: 'Ev' },
  { value: 'fa-tint', label: 'Su Damlası' },
  { value: 'fa-flask', label: 'Flask' },
  { value: 'fa-industry', label: 'Fabrika' },
  { value: 'fa-vial', label: 'Test Tüpü' },
  { value: 'fa-cogs', label: 'Dişliler' },
  { value: 'fa-tools', label: 'Aletler' },
  { value: 'fa-water', label: 'Su' },
  { value: 'fa-filter', label: 'Filtre' },
  { value: 'fa-shield-alt', label: 'Kalkan' },
  { value: 'fa-check-circle', label: 'Onay' },
  { value: 'fa-star', label: 'Yıldız' },
]

export default function IconSelector({ value, onChange, label = 'İkon Seç' }: IconSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="grid grid-cols-6 gap-2">
        {ICONS.map((icon) => (
          <button
            key={icon.value}
            type="button"
            onClick={() => onChange(icon.value)}
            className={`p-4 border-2 rounded-lg transition hover:border-blue-500 ${
              value === icon.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
            title={icon.label}
          >
            <i className={`fas ${icon.value} text-2xl ${value === icon.value ? 'text-blue-600' : 'text-gray-600'}`}></i>
          </button>
        ))}
      </div>
      
      <div className="text-sm text-gray-500">
        Seçilen: <i className={`fas ${value}`}></i> {ICONS.find(i => i.value === value)?.label || value}
      </div>
    </div>
  )
}

