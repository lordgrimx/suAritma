import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Mızrak Su Arıtma - Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Hoş geldiniz, {session.user?.name}</span>
              <Link
                href="/api/auth/signout"
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition"
              >
                Çıkış Yap
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar & Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-lg text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <i className="fas fa-dashboard mr-3 text-lg"></i>
              Dashboard
            </Link>
            <Link
              href="/admin/brands"
              className="block px-4 py-3 rounded-lg text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <i className="fas fa-building mr-3 text-lg"></i>
              Markalar
            </Link>
            <Link
              href="/admin/services"
              className="block px-4 py-3 rounded-lg text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <i className="fas fa-cogs mr-3 text-lg"></i>
              Hizmetler
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-3 rounded-lg text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <i className="fas fa-box mr-3 text-lg"></i>
              Ürünler
            </Link>
            <Link
              href="/admin/about"
              className="block px-4 py-3 rounded-lg text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <i className="fas fa-info-circle mr-3 text-lg"></i>
              Hakkımızda
            </Link>
            <Link
              href="/admin/reviews"
              className="block px-4 py-3 rounded-lg text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <i className="fas fa-star mr-3 text-lg"></i>
              Yorumlar
            </Link>
            <Link
              href="/admin/contact"
              className="block px-4 py-3 rounded-lg text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <i className="fas fa-phone mr-3 text-lg"></i>
              İletişim
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

