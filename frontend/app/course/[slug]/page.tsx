'use client'

import { use, useState } from "react";
import Sidebar from "@/components/shared/sidebar";
import useSession from "@/hooks/useSession";
import CourseTitleCard from "@/components/course/course_title_card";
import CourseDashboard from "@/components/course/course_dashboard";
import CourseDropdownAction from "@/components/course/course_dropdown_action";
import ContentCreationModal from "@/components/course/content_creation_model";

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

    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4">
                {session?.role === 'Teacher' && (
                    // dropdown menu for uploading and creating new course content
                    <div className="flex gap-4 mb-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setDropdownOpen(true)}>
                            Create new course content
                        </button>
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
                                type={contentType!} />
                        )}
                    </div>
                )}
                <CourseTitleCard title={`Course ${slug}`} description={`Description for course ${slug}`} />
                <CourseDashboard courseId={parseInt(slug)} />
            </div>
        </div>
    );
}