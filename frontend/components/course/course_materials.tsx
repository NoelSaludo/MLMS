import { useState, useEffect } from 'react'
import CourseContentCards from './course_content_card'

export default function CourseMaterialView({ courseId }: { courseId: number }) {
    const [materials, setMaterials] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await fetch(`/api/courses/${courseId}/materials`)
                if (!response.ok) {
                    throw new Error(`Error fetching materials: ${response.statusText}`)
                }
                const data = await response.json()
                // Ensure we always set an array (API may return null)
                setMaterials(Array.isArray(data) ? data : (data ? [data] : []))
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMaterials()
    }, [courseId])

    if (loading) return <p>Loading materials...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="grid grid-cols-1 gap-4">
            {materials.map((material, index) => (
                <CourseContentCards key={material.ContentID}
                    title={material.Title}
                    content={material.Description
                        || 'No description available.'}
                    courseId={courseId}
                    contentId={material.ContentID} />
            ))}
        </div>
    )
}