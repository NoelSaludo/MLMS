'use client'

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api_client';

export function useFetchCourseContentDetails(courseId: number, contentId: number) {
    const [content, setContent] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContentDetails = async () => {
            try {
                const data = await apiClient.get(`/course/${courseId}/content/${contentId}`);
                if (!data || !data.content) {
                    throw new Error("Invalid data format received from the server.");
                }
                setContent(data.content);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContentDetails();
    }, [courseId, contentId]);

    return { content, loading, error };
}