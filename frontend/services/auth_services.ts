import { apiClient } from "@/lib/api_client";   

export async function loginUser(email: string, password: string): Promise<{ access_token: string, refresh_token: string } | null> {
    try {
        const data = await apiClient.post("/auth/login", {
            email,
            password
        });

        if (!data || !data.access_token || !data.refresh_token) {
            console.log("Login failed: Missing access or refresh token in the response.");
            return null;
        }

        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token
        };
    } catch (error) {
        console.error("Error during login:", error);
        return null;
    } finally {
        console.log("User login attempt completed.");
    }
}

export async function refreshTokens(access_token: string): Promise<{ new_access_token: string, new_refresh_token: string } | null> {
    return await apiClient.get("/auth/refresh").then(res => res.data).then(data => {
        return {
            new_access_token: data.access_token, new_refresh_token: data.refresh_token
        }
    }).catch(err => {
        console.error("Error checking refresh token:", err);
        return null;
    });

}
export function isAccessTokenValid(access_token: string) {
    if (!access_token) {
        return false
    }

    let payload = decode_jwt(access_token);
    if (!payload) {
        return false
    }

    console.log("Expiry Date", new Date(payload.exp * 1000))
    console.log("isExpired?", isTokenExpired(payload.exp))
    if (isTokenExpired(payload.exp)) {
        return false
    }
}


export function isRefreshTokenValid(refresh_token: string) {
    if (!refresh_token) {
        return false
    }

    let payload = decode_jwt(refresh_token);
    if (!payload) {
        return false
    }

    console.log("expiry", payload.exp * 1000)
    if (isTokenExpired(payload.exp)) {
        return false
    }

    return true
}

function decode_jwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

function isTokenExpired(payloadExp: number) {
    return Date.now() >= payloadExp * 1000;
}