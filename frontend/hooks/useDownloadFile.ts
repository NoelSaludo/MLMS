'use client'

import { useState, useEffect } from 'react';

export function useDownloadFile(filePath: string) {
    const [file, setFile] = useState<Blob | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const downloadFile = async () => {
            if (!filePath) {
                setFile(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const fileData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/download?file_path=${encodeURIComponent(filePath)}`, {
                    method: 'GET',
                }).then(res => {
                    if (!res.ok) {
                        throw new Error(`Failed to download file: ${res.statusText}`);
                    }
                    return res.blob();
                });
                console.log("File data received:", fileData);
                if (!fileData) {
                    throw new Error("No file data received from the server.");
                }
                const blob = new Blob([fileData], { type: 'application/octet-stream' });
                setFile(blob);
            } catch (error) {
                console.error("Error downloading file:", error);
                setFile(null);
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        downloadFile();
    }, [filePath]);
    return { file, loading, error };
}
