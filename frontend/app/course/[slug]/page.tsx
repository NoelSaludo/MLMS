'use client'

import { use, useEffect, useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import useSession from "@/hooks/useSession";
import CourseTitleCard from "@/components/course/CourseTitleCard";
import CourseDashboard from "@/components/course/CourseDashboard";
import CourseDropdownAction from "@/components/course/CourseDropdownAction";
import ContentCreationModal from "@/components/course/ContentCreationModel";
import { getCourseById } from "@/lib/dal";

export default function CoursePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const session = useSession().session;
    const { slug } = use(params);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [contentType, setContentType] = useState<'announcement' | 'material' | 'assignment' | null>(null);
    const [courseData, setCourseData] = useState<any>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            const res = await fetch(`/api/courses/${slug}`);
            const data = await res.json();
            setCourseData(data.course);
        };
        fetchCourseData();
    }, [slug]);
    
    if (!courseData) {
        return <div>Loading...</div>;
    }

    console.log('Course Data:', courseData);

    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4 flex flex-col min-h-0">
                {session?.role === 'Teacher' && (
                    // dropdown menu for uploading and creating new course content
                    <div className="flex gap-4 mb-4">
                        <div className="flex flex-row items-center gap-2">
                            <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded">
                                Go Back
                            </a>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => setDropdownOpen(true)}>
                                Create new course content
                            </button>
                        </div>
                        {dropdownOpen && (
                            <CourseDropdownAction onCreateContent={
                                (type) => {
                                    setContentType(type);
                                    setModalOpen(true);
                                }}
                                setDropdownOpen={setDropdownOpen} />
                        )}
                        {modalOpen && (
                            <ContentCreationModal
                                onClose={() => setModalOpen(false)}
                                type={contentType!}
                                courseId={slug} />
                        )}
                    </div>
                )}
                <CourseTitleCard title={courseData.title} description={courseData.description} />
                <CourseDashboard courseId={parseInt(slug)} />
            </div>
        </div>
    );
}