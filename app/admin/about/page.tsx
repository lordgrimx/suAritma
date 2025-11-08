'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TextEditor from '@/components/admin/TextEditor'

export default function AboutAdmin() {
  const [data, setData] = useState({
    id: '',
    baslik: '',
    paragraflar: ['']
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sections/about')
      if (res.ok) {
        const json = await res.json()
        if (json) {
          setData({
            ...json,
            paragraflar: Array.isArray(json.paragraflar) ? json.paragraflar : []
          })
        }
      }
    } catch (error) {
      console.error('Veri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const method = data.id ? 'PUT' : 'POST'
      const res = await fetch('/api/sections/about', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setMessage('Başarıyla kaydedildi!')
        fetchData()
      } else {
        setMessage('Kaydetme hatası oluştu')
      }
    } catch (error) {
      setMessage('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const addParagraph = () => {
    setData({
      ...data,
      paragraflar: [...data.paragraflar, '']
    })
  }

  const removeParagraph = (index: number) => {
    setData({
      ...data,
      paragraflar: data.paragraflar.filter((_, i) => i !== index)
    })
  }

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...data.paragraflar]
    newParagraphs[index] = value
    setData({ ...data, paragraflar: newParagraphs })
  }

  if (loading) {
    return <div className="text-center text-xl font-semibold text-gray-800 py-8">Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hakkımızda</h1>
        <p className="text-gray-700 text-lg font-medium">Hakkımızda bölümünü düzenleyin</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={data.baslik}
                onChange={(e) => setData({ ...data, baslik: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                placeholder="Neden Biz?"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Paragraflar
                </label>
                <Button
                  onClick={addParagraph}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Paragraf Ekle
                </Button>
              </div>

              <div className="space-y-4">
                {data.paragraflar.map((paragraph, index) => (
                  <div key={index} className="relative">
                    <TextEditor
                      value={paragraph}
                      onChange={(val) => updateParagraph(index, val)}
                      label={`Paragraf ${index + 1}`}
                      rows={4}
                    />
                    {data.paragraflar.length > 1 && (
                      <Button
                        onClick={() => removeParagraph(index)}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600"
                        size="sm"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('Başarıyla') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message}
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

