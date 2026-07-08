'use client'

import { useState, FormEvent } from 'react'

export default function MakeAnAnnouncementForm({courseId}: {courseId: string}) {
    const [title, settitle] = useState('')
    const [content, setContent] = useState('')

    // TODO: Refactor this to use the action method of the form tag
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('courseId', courseId);

        const response = await fetch('/api/upload/announcement', {
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            alert('Announcement submitted successfully!');
            // refresh page 
            window.location.reload();
        } else {
            alert('Error submitting announcement.');
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
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Submit Announcement
            </button>
        </form>
    )
}