'use client'
export default function ErrorComponent({ error}: { error: string}) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-2xl font-bold text-red-600">{error}</div>
        </div>
    )
}