'use client'

import { useEffect, useState } from 'react'
import { getCourses } from '@/services/course_services'

type Course = {
    CourseID: number
    Title?: string
    Description?: string
}

export default function CourseCatalogue({ role, id }: { role: any, id?: any }) {
    const [courses, setCourses] = useState<Course[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        const controller = new AbortController()

        async function fetchCourses() {
            setLoading(true)
            setError(null)
            try {
                        const data = await getCourses(id)
                        if (data && data.courses) setCourses(data.courses)
                        else setCourses([])
            } catch (err: any) {
                if (err.name === 'AbortError') return
                setError(err.message ?? 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()

        return () => controller.abort()
    }, [id])

    return (
        <div className="col-span-3 p-4">
            {role === 'Teacher' && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Create new Course
                </button>
            )}

            <div className="flex flex-wrap align-items justify-content gap-4 mt-4">
                {loading && <div>Loading courses...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && courses && courses.length === 0 && (
                    <div>No courses found.</div>
                )}

                {!loading && !error && courses && courses.map((c) => (
                    <div key={c.CourseID} className="bg-gray-300 p-4 rounded w-1/4">
                        <a href={`/course/${c.CourseID}`}>
                            <h2>{c.Title ?? `Course ${c.CourseID}`}</h2>
                            <p>{c.Description ?? 'No description.'}</p>
                        </a>
                    </div>
                ))}

                {/* Fallback placeholder when session not available */}
                {!loading && !error && courses === null && (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-gray-300 p-4 rounded w-1/4">
                            <h2>Course {i + 1}</h2>
                            <p>Course description goes here.</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}