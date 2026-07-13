'use client';

import { apiClient } from "@/lib/api_client";
import { loginUser } from "@/services/auth_services";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [error, setError] = useState<string>("");
    const router = useRouter();

    async function handleLoginSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const data = await loginUser(email, password);

        const accessToken = data?.access_token;
        const refreshToken = data?.refresh_token;

        cookieStore.set("access_token", accessToken || "");
        cookieStore.set("refresh_token", refreshToken || "");

        router.push("/"); // Redirect to the home page after successful login
    }

    return <div className="grid grid-cols-2 justify-items-end min-h-screen items-stretch">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6">
            <h1>Login</h1>
            <form onSubmit={handleLoginSubmit} className="w-full">
                <div>
                    <label htmlFor="email">email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
        <div className="flex h-full flex-col items-center justify-center w-full max-w-md bg-blue-500">
            <span className="text-3xl font-bold text-center">Welcome to the Login Page</span>
        </div>
    </div>;
}