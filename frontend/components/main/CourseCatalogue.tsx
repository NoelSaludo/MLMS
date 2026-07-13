'use client'

import { useEffect, useState } from 'react';
import LoadingComponent from '../shared/LoadingPage';
import ErrorComponent from '../shared/ErrorComponent';

export default function CourseCatalogue({ userId, role }: { userId: string; role: string }) {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<{
        course_id: number;
        title?: string;
        description?: string
    }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true)
        async function fetchUsersCourses() {
            console.log("Fetching courses for user:", userId);
            const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}/courses`);
            const payload = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(res => res.json()).then(data => {
                console.log("Fetched courses data:", data);
                if (!data.courses) {
                    setError("No courses found for this user");
                    return null;
                }
                return data.courses;
            }).catch(err => {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch courses");
                return null;
            });

            if (!payload) {
                setError("Failed to fetch courses");
                setLoading(false);
                return;
            }

            setCourses(payload);
        }

        fetchUsersCourses();
        setLoading(false);
    }, [])

    
    if (loading) return LoadingComponent();
    if (error) return ErrorComponent({ error });
    
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
                {courses.length > 0 && courses.map((course) => (
                    <a href={`/course/${course.course_id}`} key={course.course_id} className="w-full md:w-1/2 lg:w-1/3">
                        <div className="rounded-lg border border-gray-300 p-4 shadow hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <p className="mt-2 text-gray-600">{course.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}