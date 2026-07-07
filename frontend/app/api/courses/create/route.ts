import { NextRequest, NextResponse } from 'next/server';
import { createCourse, verifySession } from "@/lib/dal";
import { uploadFile } from '@/services/file_services';

export async function POST(request: NextRequest) {
    const session = await verifySession();
    if (!session || session.role !== 'Teacher') {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await request.formData();
    const fileattachment = formData.get('fileattachment') as File | null;
    
    const fileUploadres = await uploadFile(fileattachment, formData.get('title') as string);

    if (fileUploadres.Message) {
        return new NextResponse(JSON.stringify({ error: fileUploadres.Message }), { status: 400 });
    }

    const courseData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        fileattachment: fileUploadres.file_path || null,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        status: 'draft',
    };

    const res = await createCourse(courseData);

    if (!res) {
        return new NextResponse(JSON.stringify({ error: "Failed to create course" }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ message: "Material submitted successfully!" }), { status: 200 });
}
