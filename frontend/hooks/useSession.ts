import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Session = { id: string; email: string; role: string }

export default function useSession(redirectOnUnauthorized = true) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function fetchSession() {
      setLoading(true)
      try {
        const res = await fetch('/api/session')
        if (res.status === 401) {
          if (redirectOnUnauthorized) router.push('/login')
          return
        }
        const data = await res.json()
        if (mounted) setSession(data)
      } catch (err: any) {
        if (mounted) setError(err.message ?? 'Failed to fetch session')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchSession()

    return () => { mounted = false }
  }, [router, redirectOnUnauthorized])

  return { session, loading, error }
}
