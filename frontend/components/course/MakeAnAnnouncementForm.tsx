'use client'

import { apiClient } from '@/lib/api_client';
import { useState, SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import { TextAreaFormComponent, TextInputFormComponent } from '../forms/textInputFormComponent';

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
            <TextInputFormComponent label="Title" value={title} onchange={settitle} required />
            <TextAreaFormComponent label="Content" value={content} onchange={setContent} required />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit Announcement
            </button>
        </form>
    )
}