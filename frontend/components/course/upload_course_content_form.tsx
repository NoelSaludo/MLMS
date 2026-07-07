'use client'

import { useState } from 'react'

export default function UploadCourseContentForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', content);
        if (file) {
            formData.append('fileattachment', file);
        }

        const response = await fetch('/api/upload/material', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Material submitted successfully!');
            window.location.reload();
        } else {
            alert('Error submitting material.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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