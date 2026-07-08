'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CourseContentDetail() {
    const [contentDetail, setContentDetail] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const searchParams = useSearchParams()
    const courseId = searchParams.get('courseId')
    const contentId = searchParams.get('contentId')

    useEffect(() => {
        const fetchContentDetail = async () => {
            try {
                const reqSP = new URLSearchParams()
                reqSP.append('courseId', courseId || "")
                reqSP.append('contentId', contentId || "")
                const response = await fetch(`/api/content?${reqSP.toString()}`)
                if (!response.ok) {
                    throw new Error(`Error fetching content detail: ${response.statusText}`)
                }

                const data = await response.json()
                if (!data || !data.content) {
                    throw new Error('No content detail found')
                }

                setContentDetail(data.content.content || null)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchContentDetail()
    }, [courseId, contentId])

    if (loading) return <p>Loading content details...</p>
    if (error) return <p>Error: {error}</p>
    if (!contentDetail) return <p>No content details available.</p>

    console.log('Rendering content detail:', contentDetail)

    if (contentDetail.Type === 'assignment') {
        return (
            <div>
                <h1>{contentDetail.Title}</h1>
                <p>{contentDetail.Description || 'No description available.'}</p>
                <p>Due Date: {contentDetail.DueDate || 'No due date provided.'}</p>
                {/* Render additional assignment-specific details here */}
            </div>
        )
    }

    if (contentDetail.Type === 'material') {
        return (
            <div>
                <h1>{contentDetail.Title}</h1>
                <p>{contentDetail.Description || 'No description available.'}</p>
                <a href={contentDetail.FileURL} target="_blank" rel="noopener noreferrer">
                    Download Material
                </a>
            </div>
        )
    }

    if (contentDetail.Type === 'announcement') {
        return (
            <div>
                <h1>{contentDetail.Title}</h1>
                <p>{contentDetail.Description || 'No description available.'}</p>
            </div>
        )
    }
    
    return (
        <div>
            <h1>{contentDetail.Title}</h1>
            <p>{contentDetail.Description || 'No description available.'}</p>
        </div>
    )
}