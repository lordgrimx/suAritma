import { prisma } from '@/lib/prisma'
import HomePage from '@/components/HomePage'

async function getData() {
  try {
    const [hero, brands, services, products, about, reviews, contact] = await Promise.all([
      prisma.heroSection.findFirst(),
      prisma.brand.findMany({ orderBy: { sira: 'asc' } }),
      prisma.service.findMany({ orderBy: { sira: 'asc' } }),
      prisma.product.findMany({ orderBy: { sira: 'asc' } }),
      prisma.aboutSection.findFirst(),
      prisma.review.findMany({ orderBy: [{ satir: 'asc' }, { sira: 'asc' }] }),
      prisma.contactInfo.findFirst(),
    ])

    // Debug logging
    console.log('📊 Data fetched:', {
      hero: !!hero,
      brandsCount: brands.length,
      servicesCount: services.length,
      productsCount: products.length,
      about: !!about,
      reviewsCount: reviews.length,
      contact: !!contact,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 20) + '...'
    })

    return { hero, brands, services, products, about, reviews, contact }
  } catch (error) {
    console.error('❌ Database error:', error)
    // Return fallback data if database is not ready
    return {
      hero: null,
      brands: [],
      services: [],
      products: [],
      about: null,
      reviews: [],
      contact: null
    }
  }
}

export default async function Home() {
  const data = await getData()
  return <HomePage {...data} />
}
