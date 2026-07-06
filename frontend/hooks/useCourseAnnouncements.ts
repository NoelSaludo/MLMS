import { useState, useEffect } from "react";

export default function useCourseAnnouncements(courseId: number) {
    const [contents, setContents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    console.log(`useCourseAnnouncements: courseId = ${courseId}`);
    
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`/api/courses/${courseId}/announcements`);
                if (!response.ok) {
                    throw new Error(`Error fetching announcements: ${response.statusText}`);
                }
                const data = await response.json();
                // Ensure we always set an array (API may return null)
                setContents(Array.isArray(data) ? data : (data ? [data] : []));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [courseId]);

    return { announcements: contents, loading, error };
}