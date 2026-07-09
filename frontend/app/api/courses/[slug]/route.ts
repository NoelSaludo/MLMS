import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/api-client'

type CourseBasicInfo = {
  title: string
  description: string
  startDate: string
  endDate: string
  status: string
}

interface CourseResponse {
  course?: CourseBasicInfo
  message?: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const courseId = parseInt(slug, 10)

  if (Number.isNaN(courseId)) {
    return NextResponse.json({ message: 'Invalid course id' }, { status: 400 })
  }

  try {
    const res = await apiClient.get<CourseResponse>(`/course/${courseId}`)

    if (!res || !res.course) {
      return NextResponse.json({ message: `Course with slug ${slug} not found` }, { status: 404 })
    }

    return NextResponse.json({ course: res.course }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Failed to fetch course' }, { status: 500 })
  }
}
