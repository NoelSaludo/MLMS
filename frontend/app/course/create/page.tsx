'use client'
import Sidebar from "@/components/shared/Sidebar"
import { apiClient } from "@/lib/api_client";
import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/services/file_services";
import { getUserIdFromToken } from "@/lib/auth_v2";

export default function CreateCoursePage() {
    const router = useRouter();

    async function handleCourseCreationSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const Cookies = await require('js-cookie');
            const authToken = Cookies.get('access_token');
            if (!authToken) {
                throw new Error("User is not authenticated");
            }

            const userId = getUserIdFromToken(authToken);
            if (!userId) {
                throw new Error("User ID not found in token");
            }
            formData.set("instructor_id", userId.toString());

            const filepath = await uploadFile(formData.get("file") as File, "syllabus");
            formData.delete("file"); // Remove the file from formData since we are sending the path instead
            if (!filepath) {
                throw new Error("File upload failed");
            }

            formData.set("syllabus_file_path", filepath);
            formData.set("status", "active"); // Set the status to active
            
            const data = await apiClient.post("/course/create", formData);
            if (data && data.course_id) {
                window.alert("Course created successfully!");
                router.push(`/course/${data.course_id}`);
            }

        } catch (error) {
            console.error("Error creating course:", error);
            window.alert("Error creating course. Please try again.");
        }
    }

    return (
        <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
            <Sidebar />
            <div className="col-span-3 p-4 flex flex-col min-h-0">
                <a href="/" className="text-blue-500 hover:text-blue-700">
                    Go Back
                </a>
                <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
                <form onSubmit={handleCourseCreationSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Course Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
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
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                            Upload Course Syllabus
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            className="mt-1 block w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="start_date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="end_date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create Course
                    </button>
                </form>
            </div>
        </div>
    )
}