const serverURL = process.env.BACKEND_URL;

export type PostCourseData = 
{
    title: string;
    description: string;
    fileattachment: File | null;
    startDate?: string;
    endDate?: string;
}
export async function getCourses(id?: any) {
    let url = `${serverURL}/user/${id}/courses`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return { "Message": "Failed to fetch courses" }
    }

    const data = await response.json();
    return data;
}

export async function getCourseAnnouncements(courseId: number) {
    let url = `${serverURL}/course/${courseId}/contents`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return { "Message": "Failed to fetch course announcements" }
    }
    const data = await response.json();
    return data;
}

export async function getCourseMaterials(courseId: number) {
    let url = `${serverURL}/course/${courseId}/materials`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return { "Message": "Failed to fetch course materials" }
    }
    const data = await response.json();
    return data;
}

export async function getCourseMembers(courseId: number) {
    let url = `${serverURL}/course/${courseId}/members`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return { "Message": "Failed to fetch course members" }
    }
    const data = await response.json();
    return data;
}

export async function postCourseContent(courseId: number, contentType: string, payload: any)
    : Promise<Response | null> {
    let url = `${serverURL}/course/${courseId}/contents/`;

    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('type', contentType);
    formData.append('filepathAttachment', payload.fileattachment || null);
    if (payload.score !== undefined && payload.score !== null) {
        formData.append('score', payload.score);
    }

    if (payload.duedate != null) {
        formData.append('dueDate', payload.duedate);
    }


    const response = await fetch(url, {
        method: "POST",
        body: formData
    })

    if (!response.ok) {
        return null
    }

    return response.json();
}

export function postCourse(courseData: PostCourseData) {
    let url = `${serverURL}/courses/create`;
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(courseData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                return null;
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            return null;
        });
}