export function extractPayloadFromToken(token: string){
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload) {
            return payload;
        }
    } catch (error) {
        console.error("Error extracting payload from token:", error);
    }
    return null;
}

export function getUserIdFromToken(token: string): number | null {
    const payload = extractPayloadFromToken(token);
    if (payload && payload.id) {
        return payload.id;
    }
    return null;
}