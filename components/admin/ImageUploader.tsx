'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label = 'Resim URL' }: ImageUploaderProps) {
  const [preview, setPreview] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setPreview(url)
    onChange(url)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>
      
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="https://ornek.com/resim.jpg"
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium bg-white"
      />

      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Önizleme"
            fill
            className="object-contain"
            unoptimized
            onError={() => setPreview('')}
          />
        </div>
      )}

      <div className="text-sm text-gray-700 font-medium">
        <p>• Resim URL\'sini girin veya mevcut bir URL kullanın</p>
        <p>• Önerilen boyut: 1200x630px</p>
      </div>
    </div>
  )
}

