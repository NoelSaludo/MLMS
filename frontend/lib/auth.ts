'use server'

import bcrypt from 'bcrypt'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

interface User {
  user_id: number
  email: string
  role: string
  password?: string
}

interface UserResponse {
  user?: User
  message?: string
}

export async function login(initialState: unknown, formData: FormData) {
  const email = formData.get('school_email') as string
  const password = formData.get('password') as string

  let user = null
  try {
    const res = await apiClient.get<UserResponse>(`/user/${encodeURIComponent(email)}`)
    user = res?.user || null
  } catch {
    // User not found or connection error
  }

  if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
    return {
      message: 'Invalid email or password',
    }
  }

  await createSession(String(user.user_id), email, user.role)

  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
