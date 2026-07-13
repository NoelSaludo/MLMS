'use client'

import { useEffect, useState } from 'react';
import { fetchUsersCourses } from '@/services/course_services_v2';

export function useLoadUsersCourses(userId: string) {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<{
        course_id: number;
        title?: string;
        description?: string
    }[]>([]);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function loadCourses() {
            setLoading(true)
            const data = await fetchUsersCourses({ userId });
            if (data && data.data) {
                setCourses(data.data);
            } else {
                setError(data?.error || "Failed to fetch courses");
            }
            setLoading(false);
        }

        loadCourses();
    }, [])

    return { loading, courses, error };
}