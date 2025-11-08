import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const footer = await prisma.footer.findFirst()
    return NextResponse.json(footer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch footer' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { metin, linkler } = body

    // Tek kayıt olmalı
    await prisma.footer.deleteMany()
    const footer = await prisma.footer.create({
      data: { metin, linkler },
    })

    revalidatePath('/')
    return NextResponse.json(footer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create footer' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, metin, linkler } = body

    const footer = await prisma.footer.update({
      where: { id },
      data: { metin, linkler },
    })

    revalidatePath('/')
    return NextResponse.json(footer)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update footer' }, { status: 500 })
  }
}

