'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/shared/Sidebar'

type CourseContent = {
    content_id: number
    course_id: number
    title: string
    description?: string | null
    type: 'announcement' | 'material' | 'assignment' | string
    filepath_attachment?: string | null
    FileURL?: string | null
    score?: number | null
    due_date?: string | null
}

function formatContentType(type?: string) {
    if (!type) return 'Course content'

    return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatDate(date?: string | null) {
    if (!date) return 'No due date provided.'

    return new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-gray-900">{value}</p>
        </div>
    )
}

function CourseContentDetailInner() {
    const [contentDetail, setContentDetail] = useState<CourseContent | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    const searchParams = useSearchParams()
    const courseId = searchParams.get('courseId')
    const contentId = searchParams.get('contentId')

    useEffect(() => {
        const fetchContentDetail = async () => {
            setLoading(true)
            setError(null)

            try {
                if (!courseId || !contentId) {
                    throw new Error('Course content details are missing from the request.')
                }

                const reqSP = new URLSearchParams()
                reqSP.append('courseId', courseId)
                reqSP.append('contentId', contentId)

                const response = await fetch(`/api/content?${reqSP.toString()}`)
                if (!response.ok) {
                    throw new Error(`Error fetching content detail: ${response.statusText}`)
                }

                const data = await response.json()
                if (!data || !data.content) {
                    throw new Error('No content detail found')
                }
                if (data.content.filepath_attachment) {
                    const fileResponse = await fetch(`/api/download?file_path=${encodeURIComponent(data.content.filepath_attachment)}`)
                    if (fileResponse.ok) {
                        const fileRes = await fileResponse.blob()
                        const downloadedFile = new File([fileRes], data.content.title || 'downloaded_file', { type: fileRes.type })
                        setFile(downloadedFile)
                    }
                }
                setContentDetail(data.content || null)
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Unable to load content details.')
            } finally {
                setLoading(false)
            }
        }

        fetchContentDetail()
    }, [courseId, contentId])

    const backHref = courseId ? `/course/${courseId}` : '/'
    const attachmentUrl = contentDetail?.filepath_attachment || contentDetail?.FileURL

    if (loading) {
        return (
            <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
                <Sidebar />
                <div className="col-span-3 p-4 flex flex-col min-h-0">
                    <p className="text-gray-600">Loading content details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
                <Sidebar />
                <div className="col-span-3 p-4 flex flex-col min-h-0">
                    <Link href={backHref} className="mb-4 text-blue-500 hover:text-blue-700">
                        Go Back
                    </Link>
                    <p className="text-red-600">Error: {error}</p>
                </div>
            </div>
        )
    }

    if (!contentDetail) {
        return (
            <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
                <Sidebar />
                <div className="col-span-3 p-4 flex flex-col min-h-0">
                    <Link href={backHref} className="mb-4 text-blue-500 hover:text-blue-700">
                        Go Back
                    </Link>
                    <p className="text-gray-600">No content details available.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <main className="col-span-3 p-4 flex flex-col min-h-0 overflow-y-auto">
                <Link href={backHref} className="mb-4 text-blue-500 hover:text-blue-700">
                    Go Back
                </Link>

                <section className="border border-gray-200 rounded bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
                        <span className="w-fit rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            {formatContentType(contentDetail.type)}
                        </span>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            {contentDetail.title}
                        </h1>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-900">description</h2>
                        <p className="mt-2 whitespace-pre-line text-gray-700">
                            {contentDetail.description || 'No description available.'}
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {contentDetail.type === 'assignment' && (
                            <>
                                <DetailItem label="Due Date" value={formatDate(contentDetail.due_date)} />
                                <DetailItem
                                    label="score"
                                    value={contentDetail.score ?? 'No score provided.'}
                                />
                            </>
                        )}
                    </div>

                    {(contentDetail.type === 'material' || contentDetail.type === 'assignment') && (
                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-semibold text-gray-900">Attachment</h2>
                            {file ? (
                                <a
                                    href={URL.createObjectURL(file)}
                                    download={file.name}
                                    className="mt-3 inline-flex rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                >
                                    Download Attachment
                                </a>
                            ) : (
                                <p className="mt-2 text-gray-600">No attachment available.</p>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default function CourseContentDetail() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
                <Sidebar />
                <div className="col-span-3 p-4 flex flex-col min-h-0">
                    <p className="text-gray-600">Loading content details...</p>
                </div>
            </div>
        }>
            <CourseContentDetailInner />
        </Suspense>
    )
}
