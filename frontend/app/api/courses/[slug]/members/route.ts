import {NextResponse} from 'next/server'
import {getCourseMembersById, verifySession} from '@/lib/dal'

export async function GET(request: Request, {params}: {params: any}) {
    // `params` may be a Promise in some Next.js contexts — await it first
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const courseId = parseInt(String(slug), 10);
    
    if (Number.isNaN(courseId)) {
        return NextResponse.json({error: 'Invalid course id'}, {status: 400});
    }

    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const members = await getCourseMembersById(courseId);
        return NextResponse.json(members || [], {status: 200});
    } catch (error) {
        console.error("Failed to fetch course members:", error);
        return NextResponse.json({error: "Failed to fetch course members"}, {status: 500});
    }
}