import { NextRequest, NextResponse } from "next/server";
import { getCourseContentDetails, verifySession } from "@/lib/dal";

export async function GET(request: NextRequest) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const courseId = searchParams.get("courseId") || '';
    const contentId = searchParams.get("contentId") || '';

    const res = await getCourseContentDetails(parseInt(courseId), parseInt(contentId));
    
    console.log('Fetched content details:', res);
    return NextResponse.json({ content: res }, { status: 200 });
}