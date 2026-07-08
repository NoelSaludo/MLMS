import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { cache } from 'react'
import { getUser as getUserByEmail } from '@/services/login_services'
import { findCourseById, getCourseAnnouncements as getCourseContents, getCourseMaterials, getCourseMembers, getCourses, postCourse, postCourseContent, PostCourseData } from '@/services/course_services'

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

export const getUserCourses = cache(async (userId?: number) => {
    try {
        let id = userId
        if (!id) {
            const session = await verifySession()
            if (!session) return null
            if (typeof session.id !== 'number') return null
            id = session.id
        }

        const res = await getCourses(id)
        return res.courses || null
    } catch (error) {
        console.log('Failed to fetch user courses')
        return null
    }
})

export const getCourseContentsById = cache(async (courseId: number) => {
    try {
        const res = await getCourseContents(courseId)
        return res.contents || null
    } catch (error) {
        console.log('Failed to fetch course contents')
        return null
    }

})

export const getCourseMaterialsById = cache(async (courseId: number) => {
    try {
        const res = await getCourseMaterials(courseId)
        return res.materials || null
    } catch (error) {
        console.log('Failed to fetch course materials')
        return null
    }

})

export const getCourseMembersById = cache(async (courseId: number) => {
    try {
        const res = await getCourseMembers(courseId)
        return res.members || null
    } catch (error) {
        console.log('Failed to fetch course members')
        return null
    }

})

export const uploadCourseContent = cache(
    async (courseId: number, contentType: string, payload: any): Promise<Response | null> => {
    try {
        const res = await postCourseContent(courseId, contentType, payload)
        return res || null
    } catch (error) {
        console.log('Failed to upload course content')
        return null
    }

})

export const createCourse = cache(async (courseData: PostCourseData) => {
    try {
        const res = await postCourse(courseData)
        return res || null
    } catch (error) {
        console.log('Failed to create course')
        return null
    }
})

export const getCourseById = cache(async (courseId: number) => {
    try {
        const res = await findCourseById(courseId)
        return res || null
    } catch (error) {
        console.log('Failed to fetch course by id')
        return null
    }
})

export const getCourseContentDetails = cache(async (courseId: number, contentId: number) => {
    try {
        const content = null
        return content || null
    } catch (error) {
        console.log('Failed to fetch course content details')
        return null
    }
})