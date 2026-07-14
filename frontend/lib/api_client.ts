const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";


/**
 * A simple API client for making HTTP requests to the backend.
 * It automatically includes the access token from cookies in the Authorization header.
 * It also handles JSON and FormData payloads appropriately.
 */
export namespace apiClient {
    function getToken() {
        const Cookies = require("js-cookie");
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
            console.log("Access token not found in cookies.");
            return null;
        }
        return accessToken;
    }
    async function request(method: string, endpoint: string, data?: any) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers: Record<string, string> = {};

        if (method !== "GET" && !(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const accessToken = getToken();
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const options: RequestInit = {
            method,
            headers,
        };

        const isFormData = data instanceof FormData;
        if (isFormData) {
            delete headers["Content-Type"];
        }

        if (data) {
            options.body = isFormData ? data : JSON.stringify(data);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            return { message: "Request failed", status: response.status, statusText: response.statusText };
        }
        return response.json();
    }

    /**
     * GET request to the backend API.
     * @param endpoint backend api route endpoint to make a request to
     * @returns Promise resolving to the response data or an error object
     */
    export async function get(endpoint: string) { return await request("GET", endpoint); }
    /**
     * POST request to the backend API.
     * @param endpoint backend api route endpoint to make a request to
     * @returns Promise resolving to the response data or an error object
     */
    export async function post(endpoint: string, data: any) { return await request("POST", endpoint, data); }
}
