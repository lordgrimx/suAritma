'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TextEditor from '@/components/admin/TextEditor'
import ImageUploader from '@/components/admin/ImageUploader'

interface Product {
  id: string
  baslik: string
  aciklama: string
  resimURL: string
  sira: number
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/sections/products')
      if (res.ok) {
        const json = await res.json()
        setProducts(json || [])
      }
    } catch (error) {
      console.error('Veri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingProduct) return
    
    setSaving(true)
    setMessage('')

    try {
      const method = editingProduct.id ? 'PUT' : 'POST'
      const res = await fetch('/api/sections/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      })

      if (res.ok) {
        setMessage('Başarıyla kaydedildi!')
        setEditingProduct(null)
        fetchProducts()
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
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/sections/products?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setMessage('Ürün silindi!')
        fetchProducts()
      }
    } catch (error) {
      setMessage('Silme hatası oluştu')
    }
  }

  const startEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const startNew = () => {
    setEditingProduct({
      baslik: '',
      aciklama: '',
      resimURL: '',
      sira: products.length + 1
    })
  }

  if (loading) {
    return <div className="text-center text-xl font-semibold text-gray-800 py-8">Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ürünler</h1>
          <p className="text-gray-700 text-lg font-medium">Ürün katalogunuzu yönetin</p>
        </div>
        <Button onClick={startNew} className="bg-blue-600 hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>
          Yeni Ürün
        </Button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Başarıyla') || message.includes('silindi') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {editingProduct && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {editingProduct.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={editingProduct.baslik || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, baslik: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                />
              </div>

              <TextEditor
                value={editingProduct.aciklama || ''}
                onChange={(val) => setEditingProduct({ ...editingProduct, aciklama: val })}
                label="Açıklama"
                rows={3}
              />

              <ImageUploader
                value={editingProduct.resimURL || ''}
                onChange={(url) => setEditingProduct({ ...editingProduct, resimURL: url })}
                label="Ürün Resmi URL"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Sıra
                </label>
                <input
                  type="number"
                  value={editingProduct.sira || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sira: parseInt(e.target.value) })}
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
                  onClick={() => setEditingProduct(null)}
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
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-video relative bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={product.resimURL}
                  alt={product.baslik}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{product.baslik}</h3>
              <p className="text-sm text-gray-700 mb-2 font-medium">{product.aciklama}</p>
              <p className="text-sm text-gray-700 mb-4 font-semibold">Sıra: {product.sira}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => startEdit(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Düzenle
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
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

