'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TextEditor from '@/components/admin/TextEditor'

export default function HeroAdmin() {
  const [data, setData] = useState({
    id: '',
    baslik: '',
    altBaslik: '',
    butonMetni: '',
    videoURL: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sections/hero')
      if (res.ok) {
        const json = await res.json()
        if (json) {
          setData(json)
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
      const res = await fetch('/api/sections/hero', {
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

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Section</h1>
        <p className="text-gray-600">Ana sayfa hero section\'ını düzenleyin</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={data.baslik}
                onChange={(e) => setData({ ...data, baslik: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Diyarbakır'ın Suyuna"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Başlık
              </label>
              <input
                type="text"
                value={data.altBaslik}
                onChange={(e) => setData({ ...data, altBaslik: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Mızrak Su Arıtma Sistemleri ile..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buton Metni
              </label>
              <input
                type="text"
                value={data.butonMetni}
                onChange={(e) => setData({ ...data, butonMetni: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Hemen Keşif İsteyin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="text"
                value={data.videoURL}
                onChange={(e) => setData({ ...data, videoURL: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="/video.mp4"
              />
              <p className="text-sm text-gray-500 mt-1">
                Video dosyasının yolu (public klasöründe)
              </p>
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

