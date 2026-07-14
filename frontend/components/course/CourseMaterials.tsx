'use client'

import CourseContentCards from './CourseContentCard'
import useFetchCourseMaterials from '@/hooks/useFetchCourseMaterials'

export default function CourseMaterialView({ courseId }: { courseId: number }) {
    const { materials, loading, error } = useFetchCourseMaterials(courseId)

    if (loading) return <p>Loading materials...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="grid grid-cols-1 gap-4">
            {materials.map((material) => (
                <CourseContentCards key={material.content_id}
                    title={material.title}
                    content={material.description
                        || 'No description available.'}
                    courseId={courseId}
                    contentId={material.content_id} />
            ))}
        </div>
    )
}