// Quick database check script
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    const [hero, brands, services, products, about, reviews, contact] = await Promise.all([
      prisma.heroSection.findFirst(),
      prisma.brand.findMany(),
      prisma.service.findMany(),
      prisma.product.findMany(),
      prisma.aboutSection.findFirst(),
      prisma.review.findMany(),
      prisma.contactInfo.findFirst(),
    ])

    console.log('\n📊 Database Contents:')
    console.log('Hero:', hero ? '✅ Found' : '❌ Not found')
    console.log('Brands:', brands.length, brands.length > 0 ? '✅' : '❌')
    console.log('Services:', services.length, services.length > 0 ? '✅' : '❌')
    console.log('Products:', products.length, products.length > 0 ? '✅' : '❌')
    console.log('About:', about ? '✅ Found' : '❌ Not found')
    console.log('Reviews:', reviews.length, reviews.length > 0 ? '✅' : '❌')
    console.log('Contact:', contact ? '✅ Found' : '❌ Not found')

    if (brands.length > 0) {
      console.log('\n📦 Sample Brand:', brands[0])
    }
    if (services.length > 0) {
      console.log('\n📦 Sample Service:', services[0])
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

