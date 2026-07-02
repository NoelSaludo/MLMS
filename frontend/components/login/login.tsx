import { login } from "@/lib/auth";
import Form from "next/form";
export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mt-6">
            <form action={login}>
                <input
                    required
                    className="shadow appearance-none border rounded w-full mb-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="schoolEmail"
                    type="email"
                    placeholder="School Email"
                />
                <input
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
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