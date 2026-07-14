'use client'

import { apiClient } from '@/lib/api_client';
import { useState, useEffect } from 'react';

export default function useFetchCourseContents(courseId: number) {
    const [contents, setContents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const data = await apiClient.get(`/course/${courseId}/contents`);
                if (!data || !data.contents || !Array.isArray(data.contents)) {
                    throw new Error("Invalid data format received from the server.");
                }
                setContents(data.contents);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContents();
    }, [courseId]);
    
    return { contents, loading, error };
}