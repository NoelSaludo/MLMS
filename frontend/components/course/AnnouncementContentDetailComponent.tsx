export default function AnnouncementContentDetailComponent(content: {title: string, description: string}) {
    return (
        <div className="bg-gray-100 p-4 rounded shadow-md">
            <h3 className="text-lg font-bold">{content.title}</h3>
            <p className="text-gray-600">{content.description}</p>
        </div>
    )
}