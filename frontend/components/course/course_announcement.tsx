'use client'

import useCourseAnnouncements from '@/hooks/useCourseAnnouncements'
import CourseContentCards from './course_content_card'

export default function CourseAnnouncement({ courseId }: { courseId: number }) {
    const { announcements, loading, error } = useCourseAnnouncements(courseId)

    if (loading) {
        return <div>Loading announcements...</div>
    }
    
    if (error) {
        return <div>Error loading announcements: {error}</div>
    }
    
    if (announcements.length === 0) {
        return <div>No announcements available.</div>
    }
    
    return (
        <div className="grid grid-cols-1 gap-4">
            {announcements.map((announcement) => (
                <CourseContentCards
                    title={announcement.Title}
                    content={announcement.Description || 'No description available.'}
                />
            ))}
        </div>
    )
}