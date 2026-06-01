import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
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

  // Forward verified session to server components via request headers so the
  // admin layout doesn't need a second auth() / JWT decode on every page load.
  const requestHeaders = new Headers(req.headers)
  // Strip any client-spoofed versions first
  requestHeaders.delete('x-user-name')
  requestHeaders.delete('x-user-email')
  requestHeaders.delete('x-user-image')
  if (req.auth?.user) {
    requestHeaders.set('x-user-name', req.auth.user.name ?? '')
    requestHeaders.set('x-user-email', req.auth.user.email ?? '')
    requestHeaders.set('x-user-image', req.auth.user.image ?? '')
  }
  return NextResponse.next({ request: { headers: requestHeaders } })
})

export const config = {
  matcher: ['/admin', '/admin/((?!login$).*)'],
}
