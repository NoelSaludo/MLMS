const serverUrl = process.env.BACKEND_URL;

export type PostCourseData = 
{
    title: string;
    description: string;
    syllabus_file_path: string;
    start_date?: string;
    end_date?: string;
    instructor_id: number;
}

export async function getCourses(id?: any) {
    let url = `${serverUrl}/user/${id}/courses`;
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
    let url = `${serverUrl}/course/${courseId}/contents`;
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
    let url = `${serverUrl}/course/${courseId}/materials`;
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
    let url = `${serverUrl}/course/${courseId}/members`;
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
    let url = `${serverUrl}/course/${courseId}/contents/`;

    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('type', contentType);
    formData.append('filepath_attachment', payload.fileAttachmentUrl);
    if (payload.score !== undefined && payload.score !== null) {
        formData.append('score', payload.score);
    }

    if (payload.duedate != null) {
        formData.append('due_date', payload.duedate);
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

export function postCourse(courseData: any) {
    let url = `${serverUrl}/course/create/`;

    const payload = {
        title: courseData.title,
        description: courseData.description,
        syllabus_file_path: courseData.syllabus_file_path,
        start_date: courseData.start_date || courseData.startDate,
        end_date: courseData.end_date || courseData.endDate,
        status: "active",
        instructor_id: courseData.instructor_id || courseData.instructorId
    }

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
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

export async function findCourseById(courseId: number) {
    let url = `${serverUrl}/course/${courseId}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return { "Message": "Failed to fetch course by id" }
    }
    const data = await response.json();
    return data;
}

export async function getCourseContentById(courseId: number, contentId: number) {
    const searchParams = new URLSearchParams();
    searchParams.append('courseId', courseId.toString());
    searchParams.append('contentId', contentId.toString());
    
    let url = `${serverUrl}/course/content/?${searchParams.toString()}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return { "Message": "Failed to fetch course content by id" }
    }
    const data = await response.json();
    return data;
}
