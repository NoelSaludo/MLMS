'use client'

import { useEffect, useState } from 'react'
import useUserCourses from '@/hooks/useUserCourses'

type Course = {
    CourseID: number
    Title?: string
    Description?: string
}

export default function CourseCatalogue({ role }: { role: any }) {
    const { courses, loading, error, refresh } = useUserCourses()

    console.log('loading status:', loading)
    console.log('error status:', error)
    console.log('courses data:', courses)

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