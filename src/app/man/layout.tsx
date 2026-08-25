'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Shield, BookOpen, Activity, Droplets, Users, MessageCircle, Settings, Home, Menu, X, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

const navItems: NavItem[] = [
  { href: '/man', label: 'Home', icon: Home },
  { href: '/man/education', label: 'UTI Education', icon: BookOpen },
  { href: '/man/symptoms', label: 'Symptoms', icon: Activity },
  { href: '/man/prevention', label: 'Prevention', icon: Shield },
  { href: '/man/self-care', label: 'Self-Care', icon: Droplets },
  { href: '/man/loved-ones', label: 'Loved Ones', icon: Users },
  { href: '/man/ai-assistant', label: 'AI Assistant', icon: MessageCircle },
  { href: '/man/profile', label: 'Profile', icon: Settings },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {open && <div className="mobile-nav-overlay lg:hidden" onClick={onClose} />}
      <aside className={cn('sidebar bg-white border-r border-gray-100 scrollbar-thin', open ? 'open' : '', 'lg:transform-none')}>
        <div className="sidebar-content">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/man" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-man-500 to-teal-500 flex items-center justify-center shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-gray-900">CareSphere</span>
                <div className="text-[10px] text-man-500 font-semibold">UTI Education</div>
              </div>
            </Link>
            <button className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600" onClick={onClose} aria-label="Close navigation">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/man' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} prefetch={true} onClick={onClose}
                  className={cn('nav-item', isActive && 'active-man')}
                  aria-current={isActive ? 'page' : undefined}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="health-disclaimer text-[11px] mb-3">
              <Shield className="w-3 h-3 flex-shrink-0 text-amber-600 mt-0.5" />
              <span>For education only — not medical advice</span>
            </div>
            <div className="flex items-center gap-3">
              <UserButton />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-800 truncate">My Account</div>
                <Link href="/man/profile" className="text-xs text-gray-400 hover:text-man-600 transition-colors">View profile</Link>
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
  const currentNav = navItems.find((n) => pathname === n.href || (n.href !== '/man' && pathname.startsWith(n.href)))

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center px-4 sm:px-6 gap-4">
      <button className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors" onClick={onMenuClick} aria-label="Open navigation">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-bold text-gray-900 truncate">{currentNav?.label ?? 'UTI Dashboard'}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/man/ai-assistant" className="hidden sm:flex items-center gap-1.5 btn btn-sm bg-gradient-to-r from-man-100 to-teal-100 text-man-700 border border-man-200 hover:from-man-200 hover:to-teal-200">
          <Brain className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">AI Assistant</span>
        </Link>
        <UserButton />
      </div>
    </header>
  )
}

export default function ManLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  return (
    <div className="theme-man min-h-screen bg-gray-50/50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <Link href="/man/ai-assistant" className="floating-assistant bg-gradient-to-br from-man-500 to-teal-500 lg:hidden" aria-label="Open AI assistant">
        <Brain className="w-6 h-6 text-white" />
      </Link>
    </div>
  )
}
