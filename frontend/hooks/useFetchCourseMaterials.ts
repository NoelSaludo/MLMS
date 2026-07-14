'use client'

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api_client';

export default function useFetchCourseMaterials(courseId: number) {
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchContents = async () => {
            try {
                const data = await apiClient.get(`/course/${courseId}/materials`);
                if (!data || !data.materials || !Array.isArray(data.materials)) {
                    throw new Error("Invalid data format received from the server.");
                }
                setMaterials(data.materials);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchContents();
    }, [courseId]);

    return { materials, loading, error };
}