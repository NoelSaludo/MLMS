const serverUrl = process.env.BACKEND_URL;

export async function uploadFile(file: File, courseTitle: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("course_title", courseTitle);

    const response = await fetch(`${serverUrl}/file/upload/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        return null;
    }

    return await response.json();
}

export async function downloadFile(filePath: string) {
    const response = await fetch(`${serverUrl}/file/download/?file_path=${encodeURIComponent(filePath)}`, {
        method: "GET",
    });

    if (!response.ok) {
        return null;
    }

    return await response.blob();
}
