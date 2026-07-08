import { NextRequest, NextResponse } from "next/server";
import { getCourseContentsById, verifySession } from "@/lib/dal";

type ContentType = 'announcement' | 'material' | 'assignment';

type ContentRecord = {
    ContentID: number;
    Title: string;
    Description?: string | null;
    Type: ContentType | string;
    FilepathAttachment?: string | null;
    Score?: number | null;
    DueDate?: string | null;
};

export async function GET(request: NextRequest) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = Number(searchParams.get('courseId'));
    const contentIdParam = searchParams.get('contentId');
    const contentType = searchParams.get('type')?.toLowerCase();

    if (Number.isNaN(courseId)) {
        return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
    }

    try {
        const contents = (await getCourseContentsById(courseId)) as ContentRecord[] | null;

        if (!contents || contents.length === 0) {
            return NextResponse.json({ error: "No course content found" }, { status: 404 });
        }

        let content = contentIdParam
            ? contents.find((item) => item.ContentID === Number(contentIdParam))
            : undefined;

        if (!content && contentType) {
            content = contents.find((item) => item.Type.toLowerCase() === contentType);
        }

        if (!content) {
            content = contents[0];
        }

        if (!content) {
            return NextResponse.json({ error: "Course content not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                content: {
                    contentId: content.ContentID,
                    title: content.Title,
                    description: content.Description ?? '',
                    type: content.Type.toLowerCase(),
                    fileattachment: content.FilepathAttachment ?? null,
                    score: content.Score ?? null,
                    duedate: content.DueDate ?? null,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to fetch course content:", error);
        return NextResponse.json({ error: "Failed to fetch course content" }, { status: 500 });
    }
}