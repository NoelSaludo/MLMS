'use client'
import Sidebar from "@/components/shared/sidebar"
import useSession from "@/hooks/useSession";

import {SyntheticEvent} from "react";

export default function CreateCoursePage() {
    useSession();    

    async function handleCourseCreationSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const response = await fetch('/api/courses/create', {
            method: 'POST',
            body: formData 
        });

        if (response.ok) {
            alert('Course created successfully!');
            window.location.href = '/';
        } else {
            alert('Error creating course.');
        }
    }
    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4 flex flex-col min-h-0">
                <a href="/" className="text-blue-500 hover:text-blue-700">
                    Go Back
                </a>
                <h1>Create New Course</h1>
                <form onSubmit={handleCourseCreationSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Course Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Course Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                            Upload Course Syllabus
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="fileattachment"
                            className="mt-1 block w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />  
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />  
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create Course
                    </button>
                </form>
            </div>
        </div>
    )
}