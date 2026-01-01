import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const framework = searchParams.get('framework')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    
    if (category) where.category = category
    if (framework) where.framework = framework
    if (featured === 'true') where.featured = true

    const agents = await prisma.agent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}
