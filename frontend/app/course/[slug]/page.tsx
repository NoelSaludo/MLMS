'use client'

import { use } from "react";
import Sidebar from "@/components/shared/sidebar";
import CourseTitleCard from "@/components/course/course_title_card";
import CourseDashboard from "@/components/course/course_dashboard";

export default function CoursePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params);

    // given the ID of the course, fetch the course data from the backend and display it


    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4">
                <CourseTitleCard title={`Course ${slug}`} description={`Description for course ${slug}`} />
                <CourseDashboard courseId={parseInt(slug)} />
            </div>
        </div>
    );
}