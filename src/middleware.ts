import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const path = req.nextUrl.pathname
  const isLoginPage = path === '/admin/login'
  const isAuthenticated = !!req.auth

  if (path.startsWith('/admin') && !isLoginPage && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
})

export const config = {
  matcher: ['/admin/((?!login$).*)'],
}
