'use client'

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api_client';

export default function useFetchCourseMembers(courseId: number) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await apiClient.get(`/course/${courseId}/members`);
                if (!data || !data.members || !Array.isArray(data.members)) {
                    throw new Error("Invalid data format received from the server.");
                }
                setMembers(data.members);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchMembers();
    }, [courseId]);

    return { members, loading, error };
}