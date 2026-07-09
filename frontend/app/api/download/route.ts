import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const filePath = searchParams.get('file_path')

  if (!filePath) {
    return NextResponse.json({ error: 'Missing file path' }, { status: 400 })
  }

  try {
    const response = await fetch(`${BACKEND_URL}/file/download/?file_path=${encodeURIComponent(filePath)}`)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to download file from backend' }, { status: response.status })
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': response.headers.get('Content-Disposition') || `attachment; filename="${filePath.split('/').pop()}"`
      }
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 })
  }
}
