'use client'

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/shared/Sidebar'
import { useFetchCourseContentDetails } from '@/hooks/useFetchCourseContentDetials'
import { useDownloadFile } from '@/hooks/useDownloadFile'
import LoadingComponent from '@/components/shared/LoadingPage'
import ErrorComponent from '@/components/shared/ErrorComponent'
import CourseTitleCard from '@/components/course/CourseTitleCard'
import DownloadableLinkComponent from '@/components/course/DownloadableLinkComponent'

export default function CourseContentDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const searchParams = useSearchParams()
    const contentId = searchParams.get('contentId')

    const { content, loading, error } = useFetchCourseContentDetails(Number(slug), Number(contentId))

    if (loading) {
        return <LoadingComponent />
    }
    if (error || !content) {
        return <ErrorComponent error={error || "Content not found."} />
    }

    const type = content.type
    const displayComponent = () => {
        switch (type) {
            case 'announcement':
                return (<div>
                    <h1>{content.title}</h1>
                    <p>{content.description}</p>
                </div>)
            case 'material':
                return (<div>
                    <h1>{content.title}</h1>
                    <p>{content.description}</p>
                    <DownloadableLinkComponent filepath={content.filepath_attachment} />
                </div>)
            case 'assignment':
                return (<div>
                    <h1>{content.title}</h1>
                    <p>{content.description}</p>
                    <DownloadableLinkComponent filepath={content.filepath_attachment} />
                    <p>Score: {content.score}</p>
                    <p>Submission Status: {content.submission_status}</p>
                </div>)
        }
    }

    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4">
                {/* 
                    things i need to display
                    - title
                    - description
                    - file attachment if any
                    
                    and depending on the type of content, i will display different things
                    if announcement, i will display the title and description
                    if material, i will display the title, description and file attachment
                    if assignment, i will display the title, description, file attachment, score and submission status

                    can we make a component for each display?
                 */}
                {displayComponent()}
            </div>
        </div>
    )
}