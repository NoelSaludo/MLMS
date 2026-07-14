'use client'

import { DownloadableLinkComponent } from "@/components/course/DownloadableLinkComponent";

export default function MaterialContentDetailView({content}: {content: {title: string, description: string, file_path?: string}}) {
    return (
        <div className="bg-gray-100 p-4 rounded shadow-md">
            <h3 className="text-lg font-bold">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
            <DownloadableLinkComponent filepath={content.file_path || ''} />
        </div>
    )
}