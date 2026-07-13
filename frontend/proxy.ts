import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAccessTokenValid, isRefreshTokenValid, refreshTokens } from '@/services/auth_services';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === '/login') {
        return NextResponse.next()
    }

    const access_token = request.cookies.get("access_token")?.value;
    const refresh_token = request.cookies.get("refresh_token")?.value;
    const fallbackURL = new URL('/login', request.url);

    if (!isAccessTokenValid(access_token as string)) {
        if (!isRefreshTokenValid(refresh_token as string)) {
            return NextResponse.redirect(fallbackURL)
        } else {
            // send a request to the backend to check if the refresh token is valid
            const payload = await refreshTokens(access_token as string);
            if (payload) {
                request.cookies.set("access_token", payload.new_access_token);
                request.cookies.set("refresh_token", payload.new_refresh_token);
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/course/:path*']
}