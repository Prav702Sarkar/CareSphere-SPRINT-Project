'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  Heart, Activity, Shield, BookOpen, Droplets, Apple, Moon,
  Brain, Users, BarChart2, MessageCircle, Settings, Home,
  Menu, X, Bell, Sparkles, Pill
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

const navItems: NavItem[] = [
  { href: '/woman', label: 'Home', icon: Home },
  { href: '/woman/symptoms', label: 'Symptoms', icon: Activity },
  { href: '/woman/prevention', label: 'Prevention', icon: Shield },
  { href: '/woman/education', label: 'Education', icon: BookOpen },
  { href: '/woman/remedies', label: 'Remedies', icon: Pill },
  { href: '/woman/cycle', label: 'Cycle', icon: Moon },
  { href: '/woman/pcos-pcod', label: 'PCOS / PCOD', icon: Brain },
  { href: '/woman/uti', label: 'UTI', icon: Droplets },
  { href: '/woman/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/woman/food-reminder', label: 'Food Reminder', icon: Bell },
  { href: '/woman/water-reminder', label: 'Water Reminder', icon: Droplets },
  { href: '/woman/loved-ones', label: 'Loved Ones', icon: Users },
  { href: '/woman/insights', label: 'Insights', icon: BarChart2 },
  { href: '/woman/ai-assistant', label: 'AI Assistant', icon: MessageCircle },
  { href: '/woman/profile', label: 'Profile', icon: Settings },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="mobile-nav-overlay lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'sidebar bg-white border-r border-gray-100 scrollbar-thin',
          open ? 'open' : '',
          'lg:transform-none'
        )}
        aria-label="Women's dashboard navigation"
      >
        <div className="sidebar-content">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/woman" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center shadow-sm">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900">CareSphere</span>
            </Link>
            <button
              className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Phase badge */}
          <div className="mb-6 p-3 rounded-2xl bg-gradient-to-br from-woman-50 to-rose-50 border border-woman-100">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-woman-500" />
              <span className="text-xs font-semibold text-woman-700">Cycle Phase</span>
            </div>
            <div className="text-sm font-bold text-woman-800">Follicular Phase</div>
            <div className="text-xs text-woman-500 mt-0.5">Estimated · Day 8</div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/woman' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={onClose}
                  className={cn('nav-item', isActive && 'active-woman')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="badge badge-woman text-[10px] px-1.5 py-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom — user */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="health-disclaimer text-[11px]">
              <Shield className="w-3 h-3 flex-shrink-0 text-amber-600 mt-0.5" />
              <span>For education only — not medical advice</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 min-w-0">
                <UserButton />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-800 truncate">My Account</div>
                  <Link href="/woman/profile" className="text-xs text-gray-400 hover:text-woman-600 transition-colors">
                    View profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const currentNav = navItems.find((n) =>
    pathname === n.href || (n.href !== '/woman' && pathname.startsWith(n.href))
  )

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center px-4 sm:px-6 gap-4">
      <button
        className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-bold text-gray-900 truncate">
          {currentNav?.label ?? 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/woman/ai-assistant"
          className="hidden sm:flex items-center gap-1.5 btn btn-sm bg-gradient-to-r from-woman-100 to-rose-100 text-woman-700 border border-woman-200 hover:from-woman-200 hover:to-rose-200"
        >
          <Brain className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">AI Assistant</span>
        </Link>
        <UserButton />
      </div>
    </header>
  )
}

export default function WomanLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  const pathname = usePathname()
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="theme-woman min-h-screen bg-gray-50/50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating AI assistant button */}
      <Link
        href="/woman/ai-assistant"
        className="floating-assistant bg-gradient-to-br from-woman-500 to-rose-500 lg:hidden"
        aria-label="Open AI assistant"
      >
        <Brain className="w-6 h-6 text-white" />
      </Link>
    </div>
  )
}
