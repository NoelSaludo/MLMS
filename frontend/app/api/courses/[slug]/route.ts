import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/lib/dal';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = await params;
    const courseId = parseInt(slug, 10);
    type CourseBasicInfo = {
        title:string
        description:string
        startDate:string
        endDate:string
        status:string
    }

    const res = await getCourseById(courseId); 

    if (!res.course) {
        return NextResponse.json({ message: `Course with slug ${slug} not found` }, { status: 404 });
    }

    return NextResponse.json({ course: res.course as CourseBasicInfo }, { status: 200 });
}