const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:8000";
export const apiClient = {
    async getToken() {
        const accessToken = await cookieStore.get("access_token");
        return accessToken?.value || null;
    },
    async request(method: string, endpoint: string, data?: any) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers: Record<string, string> = {};

        if (method !== "GET" && !(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const accessToken = await this.getToken();
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
    },

    async get(endpoint: string) { return await this.request("GET", endpoint); },
    async post(endpoint: string, data: any) { return await this.request("POST", endpoint, data); },
    async put(endpoint: string, data: any) { return await this.request("PUT", endpoint, data); },
    async delete(endpoint: string) { return await this.request("DELETE", endpoint); }
}