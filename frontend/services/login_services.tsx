var serverUrl = "http://localhost:8000";

export async function getUser(email: string) {
    const response = await fetch(`${serverUrl}/user/${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data.user;
}