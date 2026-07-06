import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { cache } from 'react'
import { getUser as getUserByEmail } from '@/services/login_services'
import { getCourses } from '@/services/course_services'

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.email) {
        return null
    }

    return { isAuth: true, id: session.id, email: session.email, role: session.role }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    try {
        const user = await getUserByEmail(session.email.toString())

        return user
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})

export const getUserCourses = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    try {
        const res = await getCourses(session.id)
        return res.courses || null
    } catch (error) {
        console.log('Failed to fetch user courses')
        return null
    }
    return null
})