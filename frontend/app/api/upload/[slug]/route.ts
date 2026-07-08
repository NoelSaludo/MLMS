import { NextRequest, NextResponse } from "next/server";
import { verifySession, uploadCourseContent } from "@/lib/dal";
import { uploadFile } from "@/services/file_services";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
    const verifiedslug = await params;
    const courseContentType = verifiedslug.slug; // 'announcement', 'material', or 'assignment'

    const session = await verifySession();
    if (!session || session.role !== 'Teacher') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.formData();

    switch (courseContentType) {
        case 'announcement':
            handleAnnouncementSubmission({
                courseId: payload.get('courseId') as string,
                title: payload.get('title') as string,
                content: payload.get('content') as string
            });
            return NextResponse.json({ message: "Announcement submitted successfully!" });

        case 'material':
            handleMaterialSubmission({
                courseId: payload.get('courseId') as string,
                title: payload.get('title') as string,
                description: payload.get('description') as string,
                fileattachment: payload.get('fileattachment') as File | null
            });
            return NextResponse.json({ message: "Material submitted successfully!" });

        case 'assignment':
            handleAssignmentSubmission({
                courseId: payload.get('courseId') as string,
                title: payload.get('title') as string,
                description: payload.get('description') as string,
                fileattachment: payload.get('fileattachment') as File | null,
                score: payload.get('score') ? Number(payload.get('score')) : undefined,
                duedate: payload.get('duedate') as string | undefined
            });
            return NextResponse.json({ message: "Assignment submitted successfully!" });

        default:
            return NextResponse.json({ error: "Invalid course content type" }, { status: 400 });
    }
}

async function handleAnnouncementSubmission(payload: {courseId: string; title: string; content: string }) {
    const { courseId, title, content } = payload;

    console.log("Submitting announcement:", { title, content });
    const res = await uploadCourseContent(parseInt(courseId), 'announcement', { title, description: content });
    
    if (!res?.ok) {
        return NextResponse.json({ error: "Failed to submit announcement" }, { status: 500 });
    }

    return NextResponse.json({ message: "Announcement submitted successfully!" });
}

async function handleMaterialSubmission(payload: {
    courseId: string;
    title: string;
    description: string;
    fileattachment: File | null;
}) {
    const { courseId, title, description, fileattachment } = payload;

    const fileAttachmentUrl = await uploadFile(fileattachment, courseId);

    console.log("Submitting material:", { title, description, fileattachment: fileAttachmentUrl });

    const res = await uploadCourseContent(parseInt(courseId), 'material', { title, description, fileattachment: fileAttachmentUrl });
    
    if (!res?.ok) {
        return NextResponse.json({ error: "Failed to submit material" }, { status: 500 });
    }

    return NextResponse.json({ message: "Material submitted successfully!" });
}

async function handleAssignmentSubmission(payload: {
    courseId: string;
    title: string;
    description: string;
    fileattachment: File | null;
    score?: number;
    duedate?: string
}) {
    const { courseId, title, description, fileattachment, score, duedate } = payload;

    const fileAttachmentUrl = await uploadFile(fileattachment, courseId);

    console.log("Submitting assignment:", { title, description, fileattachment: fileAttachmentUrl, score, duedate });
    const res = await uploadCourseContent(parseInt(courseId), 'assignment', { title, description, fileattachment: fileAttachmentUrl, score, duedate });

    if (!res?.ok) {
        return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
    }

    return NextResponse.json({ message: "Assignment submitted successfully!" });
}
