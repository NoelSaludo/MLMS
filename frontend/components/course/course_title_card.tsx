'use client'

export default function CourseTitleCard({title, description}: {title: string, description: string}) {
    return (
        <div className="bg-gray-300 p-4 rounded w-full">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    )
}
