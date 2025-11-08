import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contact = await prisma.contactInfo.findFirst()
    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { telefon, telefonlar, adres, calismaSaatleri, haritaURL } = body

    // Tek kayıt olmalı
    await prisma.contactInfo.deleteMany()
    const contact = await prisma.contactInfo.create({
      data: { 
        telefon, 
        telefonlar: telefonlar || [], 
        adres, 
        calismaSaatleri, 
        haritaURL 
      },
    })

    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create contact info' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, telefon, telefonlar, adres, calismaSaatleri, haritaURL } = body

    const contact = await prisma.contactInfo.update({
      where: { id },
      data: { 
        telefon, 
        telefonlar: telefonlar || [], 
        adres, 
        calismaSaatleri, 
        haritaURL 
      },
    })

    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 })
  }
}

