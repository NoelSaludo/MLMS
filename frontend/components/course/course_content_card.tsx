export default function CourseContentCards({
    title,
    content,
    courseId,
    contentId,
    type,
}: {
    title: string;
    content: string;
    courseId: number;
    contentId: number;
    type: 'announcement' | 'material' | 'assignment';
}) { 
    const href = `/course/content?courseId=${courseId}&contentId=${contentId}&type=${type}`

    return (
        <a href={href} className="block">
            <div className="bg-gray-100 p-4 rounded shadow-md">
                <h3>{title}</h3>
                <p>{content}</p>
            </div>
        </a>
    )
}
