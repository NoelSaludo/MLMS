const serverURL = process.env.BACKEND_URL;
export async function uploadFile(file: File | null, courseTitle: string) {
    if (!file) {
        return { "Message": "No file provided" }
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_title', courseTitle);
    
    const response = await fetch(`${serverURL}/file/upload/`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        return { "Message": "Failed to upload file" }
    }
    
    const data = await response.json();
    return data.file_path;
}

export async function downloadFile(filePath: string) {
    const response = await fetch(`http://localhost:8000/file/download/?file_path=${encodeURIComponent(filePath)}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    return blob;
}