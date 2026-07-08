export default function CourseContentCards({
    title,
    content,
    courseId,
    contentId,
}: {
    title: string;
    content: string;
    courseId: number;
    contentId: number;
}) { 
    const href = `/course/content?courseId=${courseId}&contentId=${contentId}`

    return (
        <a href={href} className="block">
            <div className="bg-gray-100 p-4 rounded shadow-md">
                <h3>{title}</h3>
                <p>{content}</p>
            </div>
        </a>
    )
}
