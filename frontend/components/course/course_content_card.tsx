export default function CourseContentCards({ title, content }: { title: string; content: string }) { 
    return (
        <div className="bg-gray-100 p-4 rounded shadow-md">
            <h3>{title}</h3>
            <p>{content}</p>
        </div>
    )
}
