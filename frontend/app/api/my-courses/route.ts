import { NextResponse } from 'next/server'
import { getUserCourses, verifySession } from '@/lib/dal'

export async function GET() {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await getUserCourses(session.id)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
