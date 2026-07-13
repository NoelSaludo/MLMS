export default function CreateOrJoinCourseButtonComponent({role }: { role: string }) {
    if (role === 'Teacher') {
        return (
            <a
                href="/course/create"
                className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Create New Course
            </a>
        )
    }
    
    if (role === 'Student') {
        return (
            <a
                href="/course/enroll"
                className="mb-4 inline-block rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                Enroll in a Course
            </a>
        )
    }
    return null;
}
