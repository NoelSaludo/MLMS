import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { apiClient } from '@/lib/api-client'

export async function GET(request: NextRequest) {
  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = new URL(request.url).searchParams
  const courseId = searchParams.get('courseId') || ''
  const contentId = searchParams.get('contentId') || ''

  try {
    const parsedCourseId = parseInt(courseId, 10)
    const parsedContentId = parseInt(contentId, 10)

    if (Number.isNaN(parsedCourseId) || Number.isNaN(parsedContentId)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const res = await apiClient.get<unknown>(`/course/content/?courseId=${parsedCourseId}&contentId=${parsedContentId}`)
    
    console.log('Fetched content details:', res)
    return NextResponse.json({ content: res }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content details' }, { status: 500 })
  }
}
