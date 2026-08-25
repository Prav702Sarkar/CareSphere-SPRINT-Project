'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function SignInContent() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    if (isLoaded && isSignedIn && !navigating) {
      setNavigating(true)
      const redirectUrl = searchParams?.get('redirect_url')
      if (redirectUrl && !redirectUrl.includes('/sign-in') && !redirectUrl.includes('/sign-up')) {
        router.replace(redirectUrl)
        return
      }
      router.replace('/select-role')
    }
  }, [isLoaded, isSignedIn, navigating, router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-woman-50 via-rose-50 to-peach-50 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="hero-glow w-96 h-96 -top-20 -left-20 fixed bg-woman-400" />
      <div className="hero-glow w-72 h-72 bottom-20 -right-10 fixed bg-rose-400" />

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gray-900">CareSphere</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your personalized health platform
          </p>
        </div>

        {isLoaded && isSignedIn ? (
          <div className="card p-8 text-center bg-white shadow-soft rounded-3xl space-y-4 animate-scale-in">
            <Loader2 className="w-8 h-8 text-woman-600 animate-spin mx-auto" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Signed in successfully!</h3>
              <p className="text-xs text-gray-500 mt-1">Taking you to your health dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <SignIn
              routing="hash"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/select-role"
              forceRedirectUrl="/select-role"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-soft border border-gray-100 rounded-3xl',
                  headerTitle: 'font-display font-bold text-gray-900',
                  headerSubtitle: 'text-gray-500',
                  socialButtonsBlockButton:
                    'border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors',
                  formButtonPrimary:
                    'bg-gradient-to-r from-woman-600 to-rose-600 hover:from-woman-700 hover:to-rose-700 rounded-xl font-semibold',
                  footerActionLink:
                    'text-woman-600 font-medium hover:text-woman-700',
                  formFieldInput:
                    'rounded-xl border-gray-200 focus:border-woman-400 focus:ring-woman-400',
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
