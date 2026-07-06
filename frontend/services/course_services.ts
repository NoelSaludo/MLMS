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