'use client'

import useFetchCourseMembers from '@/hooks/useFetchCourseMembers';

export default function CourseMembers({ courseId }: { courseId: number }) {
    const {members, loading, error} = useFetchCourseMembers(courseId)
    
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!members || members.length === 0) {
        return <div>No members found for this course.</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {members.map((member) => (
                // TODO: sorting by role, then by name
                <div key={member.user_id} className="p-4 border rounded shadow">
                    <h3 className="text-lg font-semibold">{member.full_name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-sm text-gray-600">role: {member.role}</p>
                </div>
            ))}
        </div>
    )
}