import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { apiClient } from '@/lib/api-client'

interface MembersResponse {
  members?: unknown[]
  message?: string
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug
  const courseId = parseInt(String(slug), 10)

  if (Number.isNaN(courseId)) {
    return NextResponse.json({ error: 'Invalid course id' }, { status: 400 })
  }

  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await apiClient.get<MembersResponse>(`/course/${courseId}/members`)
    return NextResponse.json(res.members || [], { status: 200 })
  } catch (error) {
    console.error('Failed to fetch course members:', error)
    return NextResponse.json({ error: 'Failed to fetch course members' }, { status: 500 })
  }
}
