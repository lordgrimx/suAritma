'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TextEditor from '@/components/admin/TextEditor'

interface Review {
  id: string
  isim: string
  konum: string
  yorum: string
  rating: number
  sira: number
  satir: number
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/sections/reviews')
      if (res.ok) {
        const json = await res.json()
        setReviews(json || [])
      }
    } catch (error) {
      console.error('Veri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingReview) return
    
    setSaving(true)
    setMessage('')

    try {
      const method = editingReview.id ? 'PUT' : 'POST'
      const res = await fetch('/api/sections/reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReview)
      })

      if (res.ok) {
        setMessage('Başarıyla kaydedildi!')
        setEditingReview(null)
        fetchReviews()
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
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/sections/reviews?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setMessage('Yorum silindi!')
        fetchReviews()
      }
    } catch (error) {
      setMessage('Silme hatası oluştu')
    }
  }

  const startEdit = (review: Review) => {
    setEditingReview(review)
  }

  const startNew = () => {
    setEditingReview({
      isim: '',
      konum: '',
      yorum: '',
      rating: 5,
      sira: reviews.length + 1,
      satir: 0
    })
  }

  if (loading) {
    return <div className="text-center text-xl font-semibold text-gray-800 py-8">Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Müşteri Yorumları</h1>
          <p className="text-gray-700 text-lg font-medium">Müşteri yorumlarını yönetin</p>
        </div>
        <Button onClick={startNew} className="bg-blue-600 hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>
          Yeni Yorum
        </Button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Başarıyla') || message.includes('silindi') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {editingReview && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {editingReview.id ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  İsim
                </label>
                <input
                  type="text"
                  value={editingReview.isim || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, isim: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  value={editingReview.konum || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, konum: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                  placeholder="Bağlar, Diyarbakır"
                />
              </div>

              <TextEditor
                value={editingReview.yorum || ''}
                onChange={(val) => setEditingReview({ ...editingReview, yorum: val })}
                label="Yorum"
                rows={4}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Yıldız Sayısı (1-5)
                </label>
                <select
                  value={editingReview.rating || 5}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                >
                  <option value={1}>⭐ 1 Yıldız</option>
                  <option value={2}>⭐⭐ 2 Yıldız</option>
                  <option value={3}>⭐⭐⭐ 3 Yıldız</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Yıldız</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Yıldız</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Satır (0 veya 1)
                  </label>
                  <select
                    value={editingReview.satir || 0}
                    onChange={(e) => setEditingReview({ ...editingReview, satir: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                  >
                    <option value={0}>Satır 1</option>
                    <option value={1}>Satır 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={editingReview.sira || 0}
                    onChange={(e) => setEditingReview({ ...editingReview, sira: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                  />
                </div>
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
                  onClick={() => setEditingReview(null)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  İptal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Satır 1</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.filter(r => r.satir === 0).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-user-circle text-2xl text-blue-600"></i>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.isim}</h4>
                      <p className="text-xs text-gray-700 font-semibold">{review.konum}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star text-lg ${i < (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  <p className="text-sm text-gray-800 mb-2 font-medium">{review.yorum.substring(0, 80)}...</p>
                  <p className="text-xs text-gray-700 mb-4 font-semibold">Sıra: {review.sira}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(review)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Düzenle
                    </Button>
                    <Button
                      onClick={() => handleDelete(review.id)}
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

        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Satır 2</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.filter(r => r.satir === 1).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-user-circle text-2xl text-blue-600"></i>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.isim}</h4>
                      <p className="text-xs text-gray-700 font-semibold">{review.konum}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star text-lg ${i < (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  <p className="text-sm text-gray-800 mb-2 font-medium">{review.yorum.substring(0, 80)}...</p>
                  <p className="text-xs text-gray-700 mb-4 font-semibold">Sıra: {review.sira}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(review)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Düzenle
                    </Button>
                    <Button
                      onClick={() => handleDelete(review.id)}
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
      </div>
    </div>
  )
}

