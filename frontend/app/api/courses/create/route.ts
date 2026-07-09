import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { apiClient } from '@/lib/api-client'

export async function POST(request: NextRequest) {
  const session = await verifySession()
  if (!session || session.role !== 'Teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const fileattachment = formData.get('fileattachment') as File | null

    let filePath = null
    if (fileattachment && fileattachment.size > 0) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', fileattachment)
      uploadFormData.append('course_title', formData.get('title') as string)

      const fileUploadres = await apiClient.postMultipart<{ Message?: string; file_path?: string }>('/file/upload/', uploadFormData)
      if (fileUploadres && fileUploadres.Message) {
        return NextResponse.json({ error: fileUploadres.Message }, { status: 400 })
      }
      filePath = fileUploadres?.file_path || null
    }

    const instructorId = parseInt(String(session.id), 10)
    if (Number.isNaN(instructorId)) {
      return NextResponse.json({ error: 'Invalid instructor id' }, { status: 400 })
    }

    const payload = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      syllabus_file_path: filePath || '',
      start_date: formData.get('startDate') as string,
      end_date: formData.get('endDate') as string,
      status: 'active',
      instructor_id: instructorId
    }

    const res = await apiClient.post<unknown>('/course/create/', payload)

    if (!res) {
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Material submitted successfully!' }, { status: 200 })
  } catch (error: unknown) {
    console.error('Failed to create course:', error)
    return NextResponse.json({ error: (error as Error).message || 'Failed to create course' }, { status: 500 })
  }
}
