import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Rutas protegidas
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/chats',
    '/sessions',
    '/matching',
    '/requests',
    '/mentors',
    '/reviews',
  ]

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // Si la ruta está protegida y no hay token, redirigir a login
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Si está autenticado y intenta acceder a login/register, redirigir a dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/chats/:path*',
    '/sessions/:path*',
    '/matching/:path*',
    '/requests/:path*',
    '/mentors/:path*',
    '/reviews/:path*',
    '/login',
    '/register',
  ],
}
