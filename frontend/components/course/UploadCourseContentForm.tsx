'use client'

import { apiClient } from '@/lib/api_client';
import { useState, SyntheticEvent } from 'react'

export default function UploadACourseMaterialForm({ courseId }: { courseId: string }) {
    const [title, settitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (courseId) {
            const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('title', title);
            formData.append('description', content);
            if (file) {
                const fileData = new FormData();
                fileData.append('file', file);
                fileData.append('course_title', courseId); // Assuming courseId is used as the title for the file upload
                const filePath = await apiClient.post('/upload/', fileData);
                formData.append('filepath_attachment', filePath);
            }

            try {
                const data = await apiClient.post(`/course/${courseId}/materials`, formData);
                if (!data || data.status !== "success") {
                    console.log("Failed to upload course material.");
                    return;
                }

                // Reset the form fields after successful submission
                settitle('');
                setContent('');
                setFile(null);
                alert("Course material uploaded successfully!");
                window.location.reload();

            } catch (error) {
                console.error("Error uploading course material:", error);
                alert("An error occurred while uploading the course material. Please try again.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => settitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 block w-full"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Submit Material
            </button>
        </form>
    )
}