'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TextEditor from '@/components/admin/TextEditor'
import IconSelector from '@/components/admin/IconSelector'

interface Service {
  id: string
  baslik: string
  aciklama: string
  ikon: string
  sira: number
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([])
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/sections/services')
      if (res.ok) {
        const json = await res.json()
        setServices(json || [])
      }
    } catch (error) {
      console.error('Veri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingService) return
    
    setSaving(true)
    setMessage('')

    try {
      const method = editingService.id ? 'PUT' : 'POST'
      const res = await fetch('/api/sections/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      })

      if (res.ok) {
        setMessage('Başarıyla kaydedildi!')
        setEditingService(null)
        fetchServices()
      } else {
        setMessage('Kaydetme hatası oluştu')
      }
    } catch (error) {
      setMessage('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/sections/services?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setMessage('Hizmet silindi!')
        fetchServices()
      }
    } catch (error) {
      setMessage('Silme hatası oluştu')
    }
  }

  const startEdit = (service: Service) => {
    setEditingService(service)
  }

  const startNew = () => {
    setEditingService({
      baslik: '',
      aciklama: '',
      ikon: 'fa-home',
      sira: services.length + 1
    })
  }

  if (loading) {
    return <div className="text-center text-xl font-semibold text-gray-800 py-8">Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hizmetler</h1>
          <p className="text-gray-700 text-lg font-medium">Sunduğunuz hizmetleri düzenleyin</p>
        </div>
        <Button onClick={startNew} className="bg-blue-600 hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>
          Yeni Hizmet
        </Button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Başarıyla') || message.includes('silindi') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {editingService && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {editingService.id ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={editingService.baslik || ''}
                  onChange={(e) => setEditingService({ ...editingService, baslik: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                />
              </div>

              <TextEditor
                value={editingService.aciklama || ''}
                onChange={(val) => setEditingService({ ...editingService, aciklama: val })}
                label="Açıklama"
                rows={4}
              />

              <IconSelector
                value={editingService.ikon || 'fa-home'}
                onChange={(icon) => setEditingService({ ...editingService, ikon: icon })}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Sıra
                </label>
                <input
                  type="number"
                  value={editingService.sira || 0}
                  onChange={(e) => setEditingService({ ...editingService, sira: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button
                  onClick={() => setEditingService(null)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  İptal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className={`fas ${service.ikon} text-blue-600 text-2xl`}></i>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{service.baslik}</h3>
              <p className="text-sm text-gray-700 mb-4 font-medium">{service.aciklama.substring(0, 100)}...</p>
              <p className="text-sm text-gray-700 mb-4 font-semibold">Sıra: {service.sira}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => startEdit(service)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Düzenle
                </Button>
                <Button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 hover:bg-red-600"
                  size="sm"
                >
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

