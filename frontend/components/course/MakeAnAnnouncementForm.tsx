'use client'

import { apiClient } from '@/lib/api_client';
import { useState, SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function MakeAnAnnouncementForm({ courseId }: { courseId: string }) {
    const [title, settitle] = useState('')
    const [content, setContent] = useState('')

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('courseId', courseId);

        try {
            const data = await apiClient.post(`/course/${courseId}/announcement`, formData);
            if (!data || !data.status || data.status !== "success") {
                console.log("Failed to make an announcement.");
                return;
            }

            settitle('');
            setContent('');
            alert("Announcement made successfully!");
            window.location.reload();

        } catch (error) {
            console.error("Error making announcement:", error);
            alert("An error occurred while making the announcement. Please try again.");
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