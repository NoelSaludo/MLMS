'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { downloadFile } from '@/services/file_services'

type ContentResponse = {
    contentId: number,
    title: string,
    description: string,
    type: 'announcement' | 'material' | 'assignment',
    fileattachment: string | null,
    score: number | null,
    duedate: string | null,
}

export default function Page() {
    const searchParams = useSearchParams()
    const courseId = searchParams.get('courseId')
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('type')
    const [content, setContent] = useState<ContentResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!courseId) {
            setError('Missing courseId query parameter')
            return
        }

        const fetchContent = async () => {
            try {
                const params = new URLSearchParams()
                if (courseId) {
                    params.set('courseId', courseId)
                }
                if (contentId) {
                    params.set('contentId', contentId)
                }
                if (contentType) {
                    params.set('type', contentType)
                }

                const response = await fetch(`/api/content?${params.toString()}`)
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const data = await response.json()
                setContent(data.content)
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch content')
                console.error('Error fetching content:', error)
            }
        }

        fetchContent()
    }, [courseId, contentId, contentType])

    useEffect(() => {
        return () => {
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl)
            }
        }
    }, [downloadUrl])

    const canDownloadAttachment = useMemo(() => {
        return Boolean(content?.fileattachment && (content.type === 'material' || content.type === 'assignment'))
    }, [content])

    const handleDownload = async () => {
        if (!content?.fileattachment) {
            return
        }

        const blob = await downloadFile(content.fileattachment)
        const objectUrl = URL.createObjectURL(blob)
        setDownloadUrl(objectUrl)

        const anchor = document.createElement('a')
        anchor.href = objectUrl
        anchor.download = content.fileattachment.split('/').pop() || content.title
        anchor.click()
    }

    if (error) {
        return <div>{error}</div>
    }

    if (!content) {
        return <div>Loading...</div>
    }

    if (content.type === 'announcement') {
        return (
            <div>
                <h1>{content.title}</h1>
                <p>{content.description}</p>
            </div>
        )
    }

    if (content.type === 'material') {
        return (
            <div>
                <h1>{content.title}</h1>
                <p>{content.description}</p>
                {canDownloadAttachment && (
                    <button type="button" onClick={handleDownload}>
                        Download Attachment
                    </button>
                )}
            </div>
        )
    }

    if (content.type === 'assignment') {
        return (
            <div>
                <h1>{content.title}</h1>
                <p>{content.description}</p>
                <p>Score: {content.score ?? 'Not set'}</p>
                <p>Due Date: {content.duedate ?? 'Not set'}</p>
                {canDownloadAttachment && (
                    <button type="button" onClick={handleDownload}>
                        Download Attachment
                    </button>
                )}
            </div>
        )
    }

    return <div>Unsupported content type</div>
}