import {useDownloadFile} from "@/hooks/useDownloadFile";
export function DownloadableLinkComponent({filepath, filename}: {filepath: string, filename?: string}) {
    const { file, loading, error } = useDownloadFile(filepath);

    if (loading) {
        return <p>Loading...</p>;
    }
    
    if (error) {
        return <p>Error downloading file: {error.message}</p>;
    }
    
    if (!file) {
        return <p>No file available for download.</p>;
    }

    return (
        <a href={URL.createObjectURL(file)}
           download={filename || filepath.split('/').pop() || 'downloaded_file'}
            className="text-blue-500 hover:underline"
        >
            Download File
        </a>
    );
}