'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ContactAdmin() {
  const [data, setData] = useState({
    id: '',
    telefon: '',
    telefonlar: [] as string[],
    adres: '',
    calismaSaatleri: '',
    haritaURL: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sections/contact')
      if (res.ok) {
        const json = await res.json()
        if (json) {
          setData({
            ...json,
            telefonlar: Array.isArray(json.telefonlar) ? json.telefonlar : []
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
      const res = await fetch('/api/sections/contact', {
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

  const addTelefon = () => {
    setData({
      ...data,
      telefonlar: [...data.telefonlar, '']
    })
  }

  const removeTelefon = (index: number) => {
    setData({
      ...data,
      telefonlar: data.telefonlar.filter((_, i) => i !== index)
    })
  }

  const updateTelefon = (index: number, value: string) => {
    const newTelefonlar = [...data.telefonlar]
    newTelefonlar[index] = value
    setData({ ...data, telefonlar: newTelefonlar })
  }

  if (loading) {
    return <div className="text-center text-xl font-semibold text-gray-800 py-8">Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">İletişim Bilgileri</h1>
        <p className="text-gray-700 text-lg font-medium">İletişim bilgilerini güncelleyin</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Ana Telefon
              </label>
              <input
                type="text"
                value={data.telefon}
                onChange={(e) => setData({ ...data, telefon: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                placeholder="0536 236 31 68"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Ek Telefon Numaraları
                </label>
                <Button
                  onClick={addTelefon}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                  type="button"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Numara Ekle
                </Button>
              </div>

              <div className="space-y-3">
                {data.telefonlar.map((telefon, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={telefon}
                      onChange={(e) => updateTelefon(index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                      placeholder="0XXX XXX XX XX"
                    />
                    <Button
                      onClick={() => removeTelefon(index)}
                      className="bg-red-500 hover:bg-red-600"
                      size="sm"
                      type="button"
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                ))}
                {data.telefonlar.length === 0 && (
                  <p className="text-sm text-gray-600 italic">Ek telefon numarası eklenmemiş</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Adres
              </label>
              <input
                type="text"
                value={data.adres}
                onChange={(e) => setData({ ...data, adres: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                placeholder="Diyarbakır Merkez"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Çalışma Saatleri
              </label>
              <input
                type="text"
                value={data.calismaSaatleri}
                onChange={(e) => setData({ ...data, calismaSaatleri: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                placeholder="7/24 Acil Servis"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Harita URL (iframe src)
              </label>
              <textarea
                value={data.haritaURL}
                onChange={(e) => setData({ ...data, haritaURL: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                rows={4}
                placeholder="https://www.google.com/maps/embed?..."
              />
              <p className="text-sm text-gray-700 mt-1 font-medium">
                Google Maps embed URL\'sini girin
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

