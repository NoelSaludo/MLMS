import {NextRequest, NextResponse} from "next/server";
import {verifySession} from "@/lib/dal";

export async function POST(request: NextRequest, {params}: {params: any}) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const contentType = resolvedParams?.contentType;

    if (!slug || !contentType) {
        return NextResponse.json({error: 'Missing slug or content type'}, {status: 400});
    }

    const session = await verifySession();
    if (!session || session.role !== 'Teacher') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement the logic to handle the upload based on the contentType (announcement, material, assignment)
    
    return NextResponse.json({ message: `Upload ${contentType} for course ${slug}` }, {status: 200});
}