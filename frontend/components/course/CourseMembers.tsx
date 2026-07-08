'use client'

import { useEffect, useState } from 'react'

export default function CourseMembers({ courseId }: { courseId: number }) {
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(`/api/courses/${courseId}/members`)
                if (!response.ok) {
                    throw new Error(`Error fetching members: ${response.statusText}`)
                }
                const data = await response.json()
                setMembers(data || [])
            } catch (error) {
                console.error('Failed to fetch course members:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMembers()
    }, [courseId])

    
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!members || members.length === 0) {
        return <div>No members found for this course.</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {members.map((member) => (
                // TODO: sorting by role, then by name
                <div key={member.user_id} className="p-4 border rounded shadow">
                    <h3 className="text-lg font-semibold">{member.full_name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-sm text-gray-600">role: {member.role}</p>
                </div>
            ))}
        </div>
    )
}