'use client'

import CourseCatalogue from '@/components/main/CourseCatalogue'
import Sidebar from '@/components/shared/Sidebar'
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
