'use client'

import LoadingComponent from '../shared/LoadingPage';
import ErrorComponent from '../shared/ErrorComponent';
import { useLoadUsersCourses } from '@/hooks/useLoadUsersCourses';
import CreateOrJoinCourseButtonComponent from '../course/CreateOrJoinCourseButton';

export default function CourseCatalogue({ userId, role }: { userId: string; role: string }) {
    const { loading, courses, error } = useLoadUsersCourses(userId);

    if (loading) return LoadingComponent();
    if (error) return ErrorComponent({ error });
    
    return (
        <div className="col-span-3 p-4">
            <CreateOrJoinCourseButtonComponent role={role} />

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