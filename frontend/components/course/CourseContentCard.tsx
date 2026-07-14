import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const href = `/course/${courseId}/content?contentId=${contentId}`;

    return (
        <a onClick={() => router.push(href)} className="block">
            <div className="bg-gray-100 p-4 rounded shadow-md">
                <h3>{title}</h3>
                <p>{content}</p>
            </div>
        </a>
    )
}
