const serverURL = process.env.BACKEND_URL;

export async function getCourses(id?: any) {
    let url = `${serverURL}/user/${id}/courses`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return {"Message": "Failed to fetch courses"}
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
        return {"Message": "Failed to fetch course announcements"}
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
        return {"Message": "Failed to fetch course materials"}
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
        return {"Message": "Failed to fetch course members"}
    }
    const data = await response.json();
    return data;
}