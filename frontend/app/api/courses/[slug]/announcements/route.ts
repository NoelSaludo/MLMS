import { NextResponse } from "next/server";
import { getCourseContentsById } from "@/lib/dal";

export async function GET(request: Request, { params }: { params: any }) {
    // `params` may be a Promise in some Next.js contexts — await it first
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const courseId = parseInt(String(slug), 10);

    if (Number.isNaN(courseId)) {
        return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
    }

    try {
        const contents = await getCourseContentsById(courseId);
        return NextResponse.json(contents || [], { status: 200 });
    } catch (error) {
        console.error("Failed to fetch course contents:", error);
        return NextResponse.json({ error: "Failed to fetch course contents" }, { status: 500 });
    }
}