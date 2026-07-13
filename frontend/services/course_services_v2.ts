
export async function fetchUsersCourses({ userId }: { userId: string, }) {
    console.log("Fetching courses for user:", userId);
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}/courses`);
    const payload = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => res.json()).then(data => {
        console.log("Fetched courses data:", data);
        if (!data.courses) {
            return {data: null, error: "No courses found for this user"};
        }
        return data.courses;
    }).catch(err => {
        console.error("Error fetching courses:", err);
        return {data: null, error: "Failed to fetch courses"};
        return null;
    });

    if (!payload) {
        return {data: null, error: "Failed to fetch courses"};
    }

    return {data: payload, error: null};
}