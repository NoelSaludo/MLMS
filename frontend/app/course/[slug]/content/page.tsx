'use client'

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/shared/Sidebar'
import { useFetchCourseContentDetails } from '@/hooks/useFetchCourseContentDetials'
import LoadingComponent from '@/components/shared/LoadingPage'
import ErrorComponent from '@/components/shared/ErrorComponent'
import AnnouncementContentDetailComponent from '@/components/course/AnnouncementContentDetailComponent'
import MaterialContentDetailView from '@/components/course/MaterialContentDetailView'
import { AssignmentContentView } from '@/components/course/AssignementContentView'

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
                return (<AnnouncementContentDetailComponent
                    title={content.title}
                    description={content.description} />)

            case 'material':
                return (<MaterialContentDetailView
                    content={{
                        title: content.title,
                        description: content.description,
                        file_path: content.filepath_attachment
                    }} />)

            case 'assignment':
                return (<AssignmentContentView
                    content={{
                        title: content.title,
                        description: content.description,
                        file_path: content.filepath_attachment,
                        score: content.score,
                        due_date: content.due_date
                    }} />)
        }
    }

    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4">
                {displayComponent()}
            </div>
        </div>
    )
}