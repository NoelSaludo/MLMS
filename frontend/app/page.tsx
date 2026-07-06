'use client'

import CourseCatalogue from '@/components/main/course_catalogue'
import Sidebar from '@/components/shared/sidebar'
import useSession from '@/hooks/useSession'

export default function Home() {
  const { session, loading: sessionLoading } = useSession()

  return (
    <div className="grid grid-cols-4 h-screen w-full overflow-hidden justify-center">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <CourseCatalogue  role={session?.role}/>
    </div>
  )
}
