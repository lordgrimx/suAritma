import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminDashboard() {
  const sections = [
    { 
      name: 'Markalar', 
      href: '/admin/brands', 
      icon: 'fa-building',
      description: 'Ortak markalarınızı yönetin',
      color: 'from-cyan-500 to-cyan-600'
    },
    { 
      name: 'Hizmetler', 
      href: '/admin/services', 
      icon: 'fa-cogs',
      description: 'Sunduğunuz hizmetleri düzenle',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: 'Ürünler', 
      href: '/admin/products', 
      icon: 'fa-box',
      description: 'Ürün katalogunu yönet',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Hakkımızda', 
      href: '/admin/about', 
      icon: 'fa-info-circle',
      description: 'Hakkımızda bölümünü düzenle',
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Yorumlar', 
      href: '/admin/reviews', 
      icon: 'fa-star',
      description: 'Müşteri yorumlarını yönet',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      name: 'İletişim', 
      href: '/admin/contact', 
      icon: 'fa-phone',
      description: 'İletişim bilgilerini güncelle',
      color: 'from-red-500 to-red-600'
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-700 text-lg font-medium">Site içeriğinizi buradan yönetebilirsiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group h-full bg-white border-2 border-gray-200 hover:border-blue-400">
              <CardContent className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <i className={`fas ${section.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {section.name}
                </h3>
                <p className="text-gray-700 text-sm font-medium">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Card className="bg-white border-2 border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hızlı Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-800 text-sm font-semibold">Erişim</div>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
                <div className="text-3xl font-bold text-cyan-600 mb-2">Kolay</div>
                <div className="text-gray-800 text-sm font-semibold">Kullanım</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                <div className="text-3xl font-bold text-indigo-600 mb-2">Güvenli</div>
                <div className="text-gray-800 text-sm font-semibold">Sistem</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

