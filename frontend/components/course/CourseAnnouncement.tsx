'use client'

import CourseContentCards from './CourseContentCard'
import useFetchCourseContents from '@/hooks/useFetchCourseContents';

export default function CourseAnnouncement({ courseId }: { courseId: number }) {
    const { contents, loading, error } = useFetchCourseContents(courseId);

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
            {contents.map((content) => (
                <CourseContentCards
                    key={content.content_id}
                    title={content.title}
                    content={content.description || 'No description available.'}
                    courseId={courseId}
                    contentId={content.content_id}
                />
            ))}
        </div>
    )
}
