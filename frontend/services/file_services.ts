import { apiClient } from "@/lib/api_client";

export async function uploadFile(file: File, courseTitle: string) {
    const fileData = new FormData()
    fileData.append('file', file)
    fileData.append('course_title', courseTitle)

    try {
        const filePath = await apiClient.post('/file/upload/', fileData)
        if (!filePath || !filePath.file_path || typeof filePath.file_path !== 'string') {
            throw new Error("Invalid file path received from the server.");
        }

        return filePath.file_path;
    } catch (error) {
        console.error("Error uploading file to the server:", error);
        throw error;
    }
}
