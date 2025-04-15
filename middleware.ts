// middleware.ts
import { NextRequest, NextResponse } from 'next/server'


import { jwtVerify } from 'jose';



export async function middleware(request: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const { pathname } = request.nextUrl
    const authToken = request.cookies.get('authToken');
    console.log('requst url', request.url)
    const publicPaths = ['/', '/login', '/register']
    console.log('isLoggedIn', authToken)

    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname === '/favicon.ico'

    if (!isPublicPath && !authToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (authToken) {

        console.log('decoded')
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(authToken.value, secret);
            console.log('payload', payload)
            const tokenTenantId = payload.tenantId as string;
            if (!tokenTenantId) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            if (!tokenTenantId) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
            const pathSegments = pathname.split('/');
            const queryTenantId = pathSegments[2];
            if (queryTenantId && queryTenantId !== tokenTenantId) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            // Tenant ID matches, allow the request
            return NextResponse.next();
        } catch (error) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
        }
    }



    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


