import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { apiClient } from '@/lib/api-client'

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const verifiedSlug = await params
  const contentType = verifiedSlug.slug // 'announcement', 'material', or 'assignment'

  const session = await verifySession()
  if (!session || session.role !== 'Teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.formData()

    switch (contentType) {
      case 'announcement':
        return await handleAnnouncementSubmission({
          courseId: payload.get('courseId') as string,
          title: payload.get('title') as string,
          content: payload.get('content') as string
        })

      case 'material':
        return await handleMaterialSubmission({
          courseId: payload.get('courseId') as string,
          title: payload.get('title') as string,
          description: payload.get('description') as string,
          fileattachment: payload.get('fileattachment') as File | null
        })

      case 'assignment':
        return await handleAssignmentSubmission({
          courseId: payload.get('courseId') as string,
          title: payload.get('title') as string,
          description: payload.get('description') as string,
          fileattachment: payload.get('fileattachment') as File | null,
          score: payload.get('score') ? Number(payload.get('score')) : undefined,
          duedate: payload.get('duedate') as string | undefined
        })

      default:
        return NextResponse.json({ error: 'Invalid course content type' }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('Failed to upload content:', error)
    return NextResponse.json({ error: (error as Error).message || 'Failed to upload content' }, { status: 500 })
  }
}

async function uploadFile(file: File, courseId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('course_title', courseId)
  return apiClient.postMultipart<{ file_path?: string }>('/file/upload/', formData)
}

interface CourseContentPayload {
  title: string
  description: string
  fileAttachmentUrl?: string | null
  score?: number
  duedate?: string
}

async function postCourseContent(courseId: number, contentType: string, payload: CourseContentPayload) {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('type', contentType)
  formData.append('filepath_attachment', payload.fileAttachmentUrl || '')

  if (payload.score !== undefined && payload.score !== null) {
    formData.append('score', String(payload.score))
  }
  if (payload.duedate !== undefined && payload.duedate !== null) {
    formData.append('due_date', payload.duedate)
  }

  return apiClient.postMultipart<unknown>(`/course/${courseId}/contents/`, formData)
}

async function handleAnnouncementSubmission(payload: { courseId: string; title: string; content: string }) {
  const { courseId, title, content } = payload

  console.log('Submitting announcement:', { title, content })
  const res = await postCourseContent(parseInt(courseId, 10), 'announcement', { title, description: content })

  if (!res) {
    return NextResponse.json({ error: 'Failed to submit announcement' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Announcement submitted successfully!' })
}

async function handleMaterialSubmission(payload: {
  courseId: string;
  title: string;
  description: string;
  fileattachment: File | null;
}) {
  const { courseId, title, description, fileattachment } = payload

  let fileAttachmentUrl = null
  if (fileattachment && fileattachment.size > 0) {
    const uploadRes = await uploadFile(fileattachment, courseId)
    fileAttachmentUrl = uploadRes?.file_path
  }

  console.log('Submitting material:', { title, description, fileAttachmentUrl })

  const res = await postCourseContent(parseInt(courseId, 10), 'material', { title, description, fileAttachmentUrl })

  if (!res) {
    return NextResponse.json({ error: 'Failed to submit material' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Material submitted successfully!' })
}

async function handleAssignmentSubmission(payload: {
  courseId: string;
  title: string;
  description: string;
  fileattachment: File | null;
  score?: number;
  duedate?: string;
}) {
  const { courseId, title, description, fileattachment, score, duedate } = payload

  let fileAttachmentUrl = null
  if (fileattachment && fileattachment.size > 0) {
    const uploadRes = await uploadFile(fileattachment, courseId)
    fileAttachmentUrl = uploadRes?.file_path
  }

  console.log('Submitting assignment:', { title, description, fileAttachmentUrl, score, duedate })
  const res = await postCourseContent(parseInt(courseId, 10), 'assignment', { title, description, fileAttachmentUrl, score, duedate })

  if (!res) {
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Assignment submitted successfully!' })
}
