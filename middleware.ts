// middleware.ts
import { NextRequest, NextResponse } from 'next/server'


import { jwtVerify } from 'jose';



export async function middleware(request: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const { pathname } = request.nextUrl
    const authToken = request.cookies.get('authToken');
    const publicPaths = ['/', '/login', '/register']

    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname === '/favicon.ico'
    console.log('isPublicPath', isPublicPath)
    console.log('pathname', pathname)
    console.log('authToken', authToken)
    console.log('(!isPublicPath && !authToken)', (!isPublicPath && !authToken))
    if (!isPublicPath && !authToken) {
        console.log('Redirecting to login')
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (!isPublicPath && pathname.startsWith('/api/') && authToken) {

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(authToken.value, secret);
            const tokenTenantId = payload.tenantId as string;
            if (!tokenTenantId) {
               return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
            }

         
            const pathSegments = pathname.split('/');
            const queryTenantId = pathSegments[2];

            if (queryTenantId && queryTenantId !== tokenTenantId) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
            }

            // Tenant ID matches, allow the request
            return NextResponse.next();
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }
    }



    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


