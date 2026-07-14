const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";


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

        if (data) {
            options.body = data instanceof FormData ? data : JSON.stringify(data);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            return { message: "Request failed", status: response.status, statusText: response.statusText };
        }
        return response.json();
    }

    export async function get(endpoint: string) { return await request("GET", endpoint); }
    export async function post(endpoint: string, data: any) { return await request("POST", endpoint, data); }
    export async function put(endpoint: string, data: any) { return await request("PUT", endpoint, data); }
    export async function del(endpoint: string) { return await request("DELETE", endpoint); }
}