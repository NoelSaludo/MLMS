import Login from "@/components/login/login";
export default function Page() {
    return <div className="grid grid-cols-2 justify-items-end min-h-screen items-stretch">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6">
            <h1>Login</h1>
            <Login />
        </div>
        <div className="flex h-full flex-col items-center justify-center w-full max-w-md bg-blue-500">
            <span className="text-3xl font-bold text-center">Welcome to the Login Page</span>
        </div>
    </div>;
}