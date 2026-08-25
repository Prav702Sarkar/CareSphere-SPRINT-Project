import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/woman(.*)',
  '/man(.*)',
])

const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  try {
    let userId: string | null = null
    try {
      const authResult = await auth()
      userId = authResult?.userId ?? null
    } catch {
      // Ignore token verification errors in dev
    }

    // Only consider session active if Clerk genuinely authenticated a userId
    const hasActiveSession = !!userId

    // If user is truly logged in and visits /sign-in or /sign-up, send to /select-role
    if (isAuthRoute(req) && hasActiveSession) {
      const redirectParam = req.nextUrl.searchParams.get('redirect_url')
      if (
        redirectParam &&
        !redirectParam.includes('/sign-in') &&
        !redirectParam.includes('/sign-up')
      ) {
        return NextResponse.redirect(new URL(redirectParam, req.url))
      }
      return NextResponse.redirect(new URL('/select-role', req.url))
    }

    // If user is NOT logged in and tries to access protected pages, redirect to /sign-in
    if (isProtectedRoute(req) && !hasActiveSession) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
      const res = NextResponse.redirect(signInUrl)
      // Clear any stale local auth cookies
      res.cookies.set('caresphere_auth', '', { maxAge: 0, path: '/' })
      res.cookies.set('caresphere_role', '', { maxAge: 0, path: '/' })
      return res
    }
  } catch (error) {
    console.warn('[Clerk Middleware Warning]:', error)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
