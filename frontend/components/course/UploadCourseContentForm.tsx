'use client'

import { apiClient } from '@/lib/api_client';
import { uploadFile } from '@/services/file_services';
import { useState, SyntheticEvent } from 'react'
import { TextAreaFormComponent, TextInputFormComponent } from '../forms/textInputFormComponent';
import FileInputFormComponent from '../forms/FileInputFormComponent';

export default function UploadACourseMaterialForm({ courseId }: { courseId: string }) {
    const [title, settitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (courseId) {
            try {
                const formData = new FormData();
                formData.append('course_id', courseId);
                formData.append('title', title);
                formData.append('description', content);
                if (file) {
                    const filePath = await uploadFile(file, courseId); // Assuming courseId is used as the title for the file upload
                    formData.append('filepath_attachment', filePath);
                }
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
            <TextInputFormComponent label="Title" value={title} onchange={settitle} required />
            <TextAreaFormComponent label="Description" value={content} onchange={setContent} required />
            <FileInputFormComponent label="Upload File" onchange={setFile} required />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Submit Material
            </button>
        </form>
    )
}