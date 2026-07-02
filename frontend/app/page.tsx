import { verifySession } from "@/lib/dal";
import Sidebar from "@/components/shared/sidebar";

export default async function Home() {
  const session = await verifySession();
  const role = session?.role;

  return (
    <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="col-span-3 p-4">
        {role === "Teacher" && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create new Course
          </button>
        )}
        <h1>Welcome {session?.email.toString()}!</h1>
        <div className="flex flex-wrap align-items justify-content gap-4 mt-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-300 p-4 rounded w-1/4">
              <a href={`/course/${i + 1}`}>
                <h2>Course {i + 1}</h2>
                <p>Course description goes here.</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
