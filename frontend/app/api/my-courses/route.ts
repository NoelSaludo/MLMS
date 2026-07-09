import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { apiClient } from '@/lib/api-client'

interface CoursesResponse {
  courses?: unknown[]
  message?: string
}

export async function GET() {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = parseInt(String(session.id), 10)
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid session id' }, { status: 400 })
    }

    const data = await apiClient.get<CoursesResponse>(`/user/${userId}/courses`)
    return NextResponse.json(data.courses || [])
  } catch {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
