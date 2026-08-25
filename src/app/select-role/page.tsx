'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Heart, Shield, ArrowRight, Sparkles, RefreshCw, CheckCircle2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SelectRolePage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [selectedRole, setSelectedRole] = useState<'woman' | 'man' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Auto-detect currently authenticated user from database (strictly scoped by current user ID)
  useEffect(() => {
    async function checkCurrentAccountProfile() {
      if (!isLoaded) return

      if (!isSignedIn || !user) {
        // Not signed in -> send to sign in
        router.replace('/sign-in')
        return
      }

      try {
        // Query database profile for CURRENT logged-in Clerk user only
        const res = await fetch('/api/profile', { cache: 'no-store' }).catch(() => null)
        if (res && res.ok) {
          const json = await res.json()
          if (json.profile && json.profile.role && json.profile.onboardingComplete) {
            const role = json.profile.role
            if (typeof window !== 'undefined') {
              localStorage.setItem(`caresphere_user_${user.id}_role`, role)
              localStorage.setItem('caresphere_user_role', role)
              localStorage.setItem('caresphere_onboarding_done', 'true')
              document.cookie = `caresphere_auth=true; path=/; max-age=31536000`
              document.cookie = `caresphere_role=${role}; path=/; max-age=31536000`
            }
            router.replace(role === 'man' ? '/man' : '/woman')
            return
          }
        }

        // If this account is brand new or has no completed profile, clear any stale role cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'caresphere_role=; path=/; max-age=0'
          localStorage.removeItem('caresphere_user_role')
          localStorage.removeItem('caresphere_onboarding_done')
        }
      } catch (err) {
        console.warn('[Role Auto-Detect Error]:', err)
      } finally {
        setChecking(false)
      }
    }

    checkCurrentAccountProfile()
  }, [isLoaded, isSignedIn, user, router])

  // User manual selection for new accounts
  const handleSelectRole = async (role: 'woman' | 'man') => {
    if (!user) return
    setSelectedRole(role)
    setSubmitting(true)

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`caresphere_user_${user.id}_role`, role)
        localStorage.setItem('caresphere_user_role', role)
        document.cookie = `caresphere_auth=true; path=/; max-age=31536000`
        document.cookie = `caresphere_role=${role}; path=/; max-age=31536000`
      }

      // Route directly to tailored onboarding with role configured
      router.replace(`/onboarding?role=${role}`)
    } catch (err) {
      console.warn('[Select Role Error]:', err)
      router.replace(`/onboarding?role=${role}`)
    }
  }

  if (checking || !isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/80 gap-3 p-4">
        <div className="w-16 h-16 rounded-3xl bg-white shadow-soft flex items-center justify-center border border-gray-100">
          <RefreshCw className="w-8 h-8 text-woman-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-gray-900 text-sm">Checking Your Account Profile...</h3>
          <p className="text-xs text-gray-400 mt-0.5">CareSphere is verifying your personal wellness dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-rose-50/30 to-teal-50/30 flex items-center justify-center p-4 sm:p-6">
      {/* Background glow effects */}
      <div className="hero-glow w-[500px] h-[500px] bg-woman-300/40 -top-20 -left-20 fixed" />
      <div className="hero-glow w-[450px] h-[450px] bg-teal-300/40 bottom-10 -right-20 fixed" />

      <div className="relative w-full max-w-2xl z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-2xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-woman-500" />
            Welcome, {user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Friend'}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Select Your CareSphere Experience
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            Choose the health dashboard that fits you. You can manage partner connections and privacy settings anytime.
          </p>
        </div>

        {/* 2 Portal Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Card 1: Woman Experience */}
          <button
            type="button"
            onClick={() => handleSelectRole('woman')}
            disabled={submitting}
            className={cn(
              'card p-6 sm:p-7 text-left transition-all duration-300 border-2 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-modal',
              selectedRole === 'woman'
                ? 'border-woman-500 bg-woman-50/70 ring-2 ring-woman-400'
                : 'border-gray-100 bg-white hover:border-woman-200'
            )}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-105 transition-transform">
                <Heart className="w-7 h-7 fill-white" />
              </div>
              <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-woman-100 text-woman-800 uppercase tracking-wider mb-2">
                Women&apos;s Health Platform
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                I&apos;m a Woman
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Personalized hormonal cycle tracking, PCOS/PCOD education, UTI prevention, nutrition plans & 24/7 AI wellness companion.
              </p>

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-woman-600 flex-shrink-0" />
                  <span>Cycle & Ovulation tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-woman-600 flex-shrink-0" />
                  <span>PCOS / PCOD wellness guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-woman-600 flex-shrink-0" />
                  <span>Granular Loved Ones sharing</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-xs text-woman-600 group-hover:text-woman-700 flex items-center gap-1">
                Enter Women&apos;s Portal <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="w-7 h-7 rounded-full bg-woman-50 flex items-center justify-center group-hover:bg-woman-100 transition-colors">
                <ArrowRight className="w-4 h-4 text-woman-600" />
              </div>
            </div>
          </button>

          {/* Card 2: Boys / Men Experience */}
          <button
            type="button"
            onClick={() => handleSelectRole('man')}
            disabled={submitting}
            className={cn(
              'card p-6 sm:p-7 text-left transition-all duration-300 border-2 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-modal',
              selectedRole === 'man'
                ? 'border-man-500 bg-man-50/70 ring-2 ring-man-400'
                : 'border-gray-100 bg-white hover:border-man-200'
            )}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-man-500 to-teal-500 flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-105 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-man-100 text-man-800 uppercase tracking-wider mb-2">
                Boys&apos; UTI & Wellness
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                I&apos;m a Boy / Man
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Male urological wellness, UTI symptoms & prevention, hydration habits, self-care routines & partner consent access.
              </p>

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-man-600 flex-shrink-0" />
                  <span>UTI symptoms & proactive habits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-man-600 flex-shrink-0" />
                  <span>Hydration & electrolyte tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-man-600 flex-shrink-0" />
                  <span>Consent-based partner access</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="font-bold text-xs text-man-600 group-hover:text-man-700 flex items-center gap-1">
                Enter Boys&apos; Portal <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="w-7 h-7 rounded-full bg-man-50 flex items-center justify-center group-hover:bg-man-100 transition-colors">
                <ArrowRight className="w-4 h-4 text-man-600" />
              </div>
            </div>
          </button>
        </div>

        {/* Security & Disclaimer Footer */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            100% Private · Encrypted with Row Level Security
          </span>
          <span className="text-[11px] text-gray-400">
            CareSphere Health Education
          </span>
        </div>
      </div>
    </div>
  )
}
