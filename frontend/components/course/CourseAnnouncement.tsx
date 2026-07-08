'use client'

import useCourseContents from '@/hooks/useCourseAnnouncements'
import CourseContentCards from './CourseContentCard'

export default function CourseAnnouncement({ courseId }: { courseId: number }) {
    const { announcements: contents, loading, error } = useCourseContents(courseId)

    if (loading) {
        return <div>Loading announcements...</div>
    }
    
    if (error) {
        return <div>Error loading announcements: {error}</div>
    }
    
    if (contents.length === 0) {
        return <div>No announcements available.</div>
    }
    
    return (
        <div className="grid grid-cols-1 gap-4 mt-4 overflow-y-auto max-h-[calc(100vh-300px)]">
            {contents.map((announcement) => (
                <CourseContentCards
                    key={announcement.content_id}
                    title={announcement.title}
                    content={announcement.description || 'No description available.'}
                    courseId={courseId}
                    contentId={announcement.content_id}
                />
            ))}
        </div>
    )
}