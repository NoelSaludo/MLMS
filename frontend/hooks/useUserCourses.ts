import { useEffect, useState, useCallback } from 'react'

type Course = { CourseID: number; Title?: string; Description?: string }

export default function useUserCourses() {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/my-courses')
      if (res.status === 401) {
        setCourses([])
        return
      }
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      console.log('Fetched courses data:', data)
      setCourses(data)
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch courses')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return { courses, loading, error, refresh: fetchCourses }
}
