import { logout } from "@/lib/auth";

export default function Sidebar() {
    return (
        <div className="bg-gray-200 p-4">
            <h2>Sidebar</h2>
            <ul>
                <li>Link 1</li>
                <li>Link 2</li>
                <li>Link 3</li>
            </ul>
            <form action={logout}>
                <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                    Logout
                </button>
            </form>
        </div>
    );
}
