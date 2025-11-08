import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const about = await prisma.aboutSection.findFirst()
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about section' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { baslik, paragraflar } = body

    // Tek kayıt olmalı
    await prisma.aboutSection.deleteMany()
    const about = await prisma.aboutSection.create({
      data: { baslik, paragraflar },
    })

    revalidatePath('/')
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create about section' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, baslik, paragraflar } = body

    const about = await prisma.aboutSection.update({
      where: { id },
      data: { baslik, paragraflar },
    })

    revalidatePath('/')
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 })
  }
}

