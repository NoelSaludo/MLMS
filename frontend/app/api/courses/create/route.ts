import { NextRequest, NextResponse } from 'next/server';
import { createCourse, verifySession } from "@/lib/dal";
import { PostCourseData } from '@/services/course_services';

export async function POST(request: NextRequest) {
    const session = await verifySession();
    if (!session || session.role !== 'Teacher') {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fileattachment = formData.get('fileattachment') as File | null;
    const startDate = formData.get('startDate') as string | undefined;
    const endDate = formData.get('endDate') as string | undefined;

    // Here you would typically save the material to your database
    const courseData: PostCourseData = {
        title,
        description,
        fileattachment,
        startDate,
        endDate
    };
    const res = await createCourse(courseData);

    if (!res?.ok) {
        return new NextResponse(JSON.stringify({ error: "Failed to create course" }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ message: "Material submitted successfully!" }), { status: 200 });
}
