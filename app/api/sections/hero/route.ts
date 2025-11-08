import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst()
    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { baslik, altBaslik, butonMetni, videoURL } = body

    // Mevcut hero section'ı sil ve yenisini oluştur (tek kayıt olmalı)
    await prisma.heroSection.deleteMany()
    const hero = await prisma.heroSection.create({
      data: {
        baslik,
        altBaslik,
        butonMetni,
        videoURL,
      },
    })

    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create hero section' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, baslik, altBaslik, butonMetni, videoURL } = body

    const hero = await prisma.heroSection.update({
      where: { id },
      data: {
        baslik,
        altBaslik,
        butonMetni,
        videoURL,
      },
    })

    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 })
  }
}

