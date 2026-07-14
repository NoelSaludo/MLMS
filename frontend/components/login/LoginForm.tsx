'use client';

import { useActionState } from "react";
import { login } from "@/lib/auth";

const initialState = {
    message: "",
}
export default function LoginForm() {
    const [state, formAction, pending] = useActionState(login, initialState);
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mt-6">
            <form action={formAction} className="w-full max-w-md">
                <p aria-live="polite">{state?.message}</p>
                <input
                    required
                    className="shadow appearance-none border rounded w-full mb-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="school_email"
                    name="school_email"
                    type="email"
                    placeholder="School email"
                />
                <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                />
                <a href="/forgot-password" className="text-blue-500 hover:text-blue-700 text-sm mt-2">
                    Forgot password?
                </a>
                <div className="flex items-center justify-center mt-4 w-full">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded">
                        Login
                    </button>
                </div>
            </form>
        </div >
    );
}