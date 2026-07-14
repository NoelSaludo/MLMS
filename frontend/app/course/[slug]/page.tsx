'use client'

import ContentCreationModal from "@/components/course/ContentCreationModel";
import CourseDropdownAction from "@/components/course/CourseDropdownAction";
import Sidebar from "@/components/shared/Sidebar";
import { useState, useEffect, use } from "react";


export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [contentToCreate, setContentToCreate] = useState<'announcement' | 'material' | 'assignment'>('announcement');
    const [courseData, setCourseData] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {

    })

    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4 flex flex-col min-h-0">
                <div className="flex gap-4 mb-4">
                        <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded">
                            Go Back
                        </a>
                    <div className="flex-1 text-end">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => setDropdownOpen(true)}>
                            Create new course content
                        </button>
                        {dropdownOpen && (
                            <CourseDropdownAction onCreateContent={
                                (type) => {
                                    setContentToCreate(type);
                                    setModalOpen(true);
                                }}
                                setDropdownOpen={setDropdownOpen} />
                        )}
                        {modalOpen && (
                            <ContentCreationModal
                                onClose={() => setModalOpen(false)}
                                type={contentToCreate!}
                                courseId={slug} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}