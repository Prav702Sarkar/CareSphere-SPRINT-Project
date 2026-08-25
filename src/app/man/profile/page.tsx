'use client'

import { useState } from 'react'
import { useUser, UserButton, useClerk } from '@clerk/nextjs'
import {
  Shield,
  Bell,
  Lock,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Droplets,
  Activity,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  icon: string
}

export default function ManProfilePage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [loggingOut, setLoggingOut] = useState(false)
  const [activeModal, setActiveModal] = useState<'notifications' | 'disclaimer' | null>(null)

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of CareSphere?')) {
      setLoggingOut(true)
      if (typeof window !== 'undefined') {
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('caresphere')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k))
        document.cookie = 'caresphere_auth=; path=/; max-age=0'
        document.cookie = 'caresphere_role=; path=/; max-age=0'
        document.cookie = '__client_uat=0; path=/;'
      }
      try {
        await signOut({ redirectUrl: '/' })
      } catch (err) {
        console.warn('[Logout]:', err)
      }
      window.location.href = '/'
    }
  }

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Hydration Target',
      message: 'Maintain healthy urinary flushing by drinking a glass of water now. 💧',
      time: '20 mins ago',
      read: false,
      icon: '💧',
    },
    {
      id: '2',
      title: 'Urological Wellness Tip',
      message: 'Post-exercise hydration helps maintain healthy electrolyte and kidney balance. 🏃‍♂️',
      time: '2 hours ago',
      read: false,
      icon: '🏃‍♂️',
    },
    {
      id: '3',
      title: 'Partner Connection Active',
      message: 'You have verified access to view permitted health information. 🔒',
      time: 'Yesterday',
      read: true,
      icon: '🔒',
    },
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    hydrationAlerts: true,
    partnerUpdates: true,
    preventionTips: true,
  })

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">Profile & Settings</h2>
        <p className="section-subtitle">Manage your account, notification alerts, and partner connection</p>
      </div>

      {/* Account Card */}
      <div className="card p-6 flex items-center gap-5 border border-gray-100 shadow-soft">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-man-100 to-teal-100 flex items-center justify-center shadow-2xs flex-shrink-0">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-12 h-12 rounded-2xl shadow-sm',
              },
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl font-bold text-gray-900 truncate">
            {user?.fullName ?? user?.primaryEmailAddress?.emailAddress?.split('@')[0] ?? 'CareSphere User'}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">{user?.primaryEmailAddress?.emailAddress}</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-man-100 text-man-700 text-xs font-semibold mt-2 shadow-2xs">
            <Sparkles className="w-3 h-3 text-man-600" /> Urological Wellness Platform
          </div>
        </div>
      </div>

      {/* Settings Tiles */}
      <div className="space-y-3">
        {/* 1. Notifications Tile */}
        <button
          type="button"
          onClick={() => setActiveModal('notifications')}
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-gray-100 hover:border-man-200"
          id="man-notifications-tile-btn"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                Notifications Center
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">
                View all recent hydration reminders, prevention tips & partner updates
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-man-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        {/* 2. Partner Access Tile */}
        <Link
          href="/man/loved-ones"
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-gray-100 hover:border-man-200"
          id="man-partner-access-tile-btn"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-man-50 to-teal-50 border border-man-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Lock className="w-5 h-5 text-man-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900">Partner Access & Loved Ones</div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">
                Manage partner connections, request verification & permitted data view
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-man-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </Link>

        {/* 3. Health Disclaimer Tile */}
        <button
          type="button"
          onClick={() => setActiveModal('disclaimer')}
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-gray-100 hover:border-man-200"
          id="man-health-disclaimer-tile-btn"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900">Health Disclaimer & Safety Policy</div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">
                Read our clinical safety standards, emergency escalation & privacy guidelines
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-man-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        {/* 4. Log Out Tile */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-red-100 hover:border-red-300 hover:bg-red-50/40 transition-all"
          id="man-logout-tile-btn"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-red-600 flex items-center gap-2">
                {loggingOut ? 'Signing Out...' : 'Log Out of CareSphere'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">
                Safely sign out from all dashboard pages and end active session
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>
      </div>

      {/* Health Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
        <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          CareSphere is a health education platform only. It does not provide medical diagnoses, prescriptions, or emergency medical services.
        </span>
      </div>

      {/* ================= MODAL 1: NOTIFICATIONS CENTER ================= */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveModal(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] z-10 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 flex-shrink-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">Notifications Center</h3>
                  <p className="text-xs text-gray-400">Manage reminder alerts and view activity history</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-4 pr-1 flex-1 scrollbar-thin">
              {/* Notification Toggles */}
              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2.5">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Alert Preferences</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'hydrationAlerts', label: '💧 Hydration Prompts' },
                    { key: 'preventionTips', label: '🛡️ Prevention Tips' },
                    { key: 'partnerUpdates', label: '🔒 Partner Syncs' },
                  ].map((p) => {
                    const enabled = (notificationSettings as any)[p.key]
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => {
                          const updated = { ...notificationSettings, [p.key]: !enabled }
                          setNotificationSettings(updated)
                        }}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-left font-semibold',
                          enabled
                            ? 'bg-white border-man-300 text-man-900 shadow-2xs'
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                        )}
                      >
                        <span className="truncate">{p.label}</span>
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.2 rounded-full', enabled ? 'bg-man-100 text-man-800' : 'bg-gray-200 text-gray-500')}>
                          {enabled ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* History */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Recent Activity</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-man-600 hover:text-man-700"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'p-3.5 rounded-2xl border transition-all flex items-start gap-3',
                      n.read
                        ? 'bg-white border-gray-100 opacity-80'
                        : 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                    )}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-2xs flex items-center justify-center text-base flex-shrink-0">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-gray-900">{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 pt-3.5 border-t border-gray-100 flex-shrink-0 mt-2">
              <button
                type="button"
                className="btn btn-primary-man w-full py-2.5 text-xs font-semibold rounded-xl shadow-md"
                onClick={() => setActiveModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: HEALTH DISCLAIMER ================= */}
      {activeModal === 'disclaimer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveModal(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] z-10 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 flex-shrink-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">Health & Clinical Disclaimer</h3>
                  <p className="text-xs text-gray-400">Our safety standards and educational policy</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-3.5 pr-1 flex-1 scrollbar-thin text-xs text-gray-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Evidence-Based Wellness Education:</strong> CareSphere synthesizes peer-reviewed clinical guidelines, urological protocols, and hydration science.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-xs">1. Not Medical Diagnoses</h4>
                <p>
                  CareSphere does not provide formal medical diagnoses or prescriptions. Always consult a urologist or healthcare provider for clinical evaluation.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-xs">2. Emergency Escalation</h4>
                <p>
                  If you experience high fever, severe flank/groin pain, visible blood in urine, or chills, seek immediate medical care.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 pt-3.5 border-t border-gray-100 flex-shrink-0 mt-2">
              <button
                type="button"
                className="btn btn-primary-man w-full py-2.5 text-xs font-semibold rounded-xl shadow-md"
                onClick={() => setActiveModal(null)}
              >
                I Understand & Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
