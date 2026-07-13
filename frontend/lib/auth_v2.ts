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