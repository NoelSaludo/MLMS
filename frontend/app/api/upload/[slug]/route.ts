import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";

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
                title: payload.get('title') as string,
                content: payload.get('content') as string
            });
            return NextResponse.json({ message: "Announcement submitted successfully!" });

        case 'material':
            handleMaterialSubmission({
                title: payload.get('title') as string,
                description: payload.get('description') as string,
                fileattachment: payload.get('fileattachment') as File | null
            });
            return NextResponse.json({ message: "Material submitted successfully!" });

        case 'assignment':
            handleAssignmentSubmission({
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

async function handleAnnouncementSubmission(payload: { title: string; content: string }) {
    const { title, content } = payload;

    console.log("Announcement submitted:", { title, content });

    return NextResponse.json({ message: "Announcement submitted successfully!" });
}

async function handleMaterialSubmission(payload: {
    title: string;
    description: string;
    fileattachment?: File | null;
}) {
    const { title, description, fileattachment } = payload;

    console.log("Material submitted:", { title, description, fileattachment });

    return NextResponse.json({ message: "Material submitted successfully!" });
}

async function handleAssignmentSubmission(payload: {
    title: string;
    description: string;
    fileattachment?: File | null;
    score?: number;
    duedate?: string
}) {
    const { title, description, fileattachment, score, duedate } = payload;

    console.log("Assignment submitted:", { title, description, fileattachment, score, duedate });

    return NextResponse.json({ message: "Assignment submitted successfully!" });
}
