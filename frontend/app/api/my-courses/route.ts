import { NextResponse } from 'next/server'
import { getUserCourses } from '@/lib/dal'

export async function GET() {
  try {
    const data = await getUserCourses()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
