import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            }).then(res => res.json()).catch(err => {
                console.error("Error checking refresh token:", err);
                return null;
            });

            request.cookies.set("access_token", res.access_token)
            request.cookies.set("refresh_token", res.refresh_token)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/course/:path*']
}

function isAccessTokenValid(access_token: string) {
    if (!access_token) {
        return false
    }

    let payload = decode_jwt(access_token);
    if (!payload) {
        return false
    }

    console.log("Expiry Date", new Date(payload.exp * 1000))
    console.log("isExpired?", isTokenExpired(payload.exp))
    if (isTokenExpired(payload.exp)) {
        return false
    }
}


function isRefreshTokenValid(refresh_token: string) {
    if (!refresh_token) {
        return false
    }

    let payload = decode_jwt(refresh_token);
    if (!payload) {
        return false
    }

    console.log("expiry", payload.exp * 1000)
    if (isTokenExpired(payload.exp)) {
        return false
    }

    return true
}

function decode_jwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

function isTokenExpired(payloadExp: number) {
    return Date.now() >= payloadExp * 1000;
}