'use client'

import useUserCourses from '@/hooks/useUserCourses'

export default function CourseCatalogue({ role }: { role: any }) {
    const { courses, loading, error, refresh } = useUserCourses()
    return (
        <div className="col-span-3 p-4">
            {role === 'Teacher' && (
                <a
                    href="/course/create"
                    className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Create New Course
                </a>
            )}

            {role === 'Student' && (
                <a
                    href="/course/enroll"
                    className="mb-4 inline-block rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                    Enroll in a Course
                </a>
            )}

            <div className="flex flex-wrap align-items justify-content gap-4 mt-4">
                {loading && <div>Loading courses...</div>}

                {error && <div className="text-red-600">{error}</div>}

                {!loading && !error && courses && courses.length === 0 && (
                    <div>No courses found.</div>
                )}

                {!loading && !error && courses && courses.map((c) => (
                    <a href={`/course/${c.CourseID}`} className="bg-gray-300 p-4 rounded w-1/4" key={c.CourseID}>
                        <h2>{c.Title ?? `Course ${c.CourseID}`}</h2>
                        <p>{c.Description ?? 'No description.'}</p>
                    </a>
                ))}
            </div>
        </div>
    )
}