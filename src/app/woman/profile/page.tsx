'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton, useClerk } from '@clerk/nextjs'
import {
  Heart,
  Shield,
  Bell,
  Lock,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Calendar,
  Droplets,
  Activity,
  AlertCircle,
  Clock,
  ExternalLink,
  Flame,
  FileText,
  Volume2,
  CheckCircle2,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Types
interface HealthProfileData {
  cycleLength: number
  periodDuration: number
  conditions: string[]
  primaryGoal: string
  dailyWaterTarget: number
  sleepHours: number
  stressLevel: string
}

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'water' | 'food' | 'cycle' | 'partner'
  read: boolean
  icon: string
}

export default function WomanProfilePage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [loggingOut, setLoggingOut] = useState(false)

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

  // Modal states
  const [activeModal, setActiveModal] = useState<'health' | 'notifications' | 'disclaimer' | null>(null)

  // Health Profile State
  const [healthProfile, setHealthProfile] = useState<HealthProfileData>({
    cycleLength: 28,
    periodDuration: 5,
    conditions: ['pcos_pcod'],
    primaryGoal: 'Cycle & UTI Prevention',
    dailyWaterTarget: 2000,
    sleepHours: 7.5,
    stressLevel: 'Moderate',
  })
  const [healthSaved, setHealthSaved] = useState(false)
  const [savingHealth, setSavingHealth] = useState(false)

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Hydration Target',
      message: 'You have logged 850ml today. Drink a glass of water to reach your 2,000ml goal! 💧',
      time: '15 mins ago',
      type: 'water',
      read: false,
      icon: '💧',
    },
    {
      id: '2',
      title: 'Meal Reminder: Lunch',
      message: 'Time for balanced nutrition — focus on lean proteins and fiber-rich greens. 🥗',
      time: '1 hour ago',
      type: 'food',
      read: false,
      icon: '🥗',
    },
    {
      id: '3',
      title: 'Cycle Phase Insight',
      message: 'You are currently in your Follicular Phase (Day 8). Estrogen is rising — optimal energy window. 🌸',
      time: 'Today, 8:00 AM',
      type: 'cycle',
      read: true,
      icon: '🌸',
    },
    {
      id: '4',
      title: 'Privacy & Sharing Sync',
      message: 'Your partner permissions are active and securely synced with backend RLS encryption. 🔒',
      time: 'Yesterday',
      type: 'partner',
      read: true,
      icon: '🔒',
    },
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    foodReminders: true,
    waterAlerts: true,
    cycleUpdates: true,
    partnerAlerts: true,
  })

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHp = localStorage.getItem('caresphere_health_profile')
      if (savedHp) {
        try { setHealthProfile(JSON.parse(savedHp)) } catch {}
      }
      const savedNotifs = localStorage.getItem('caresphere_notif_prefs')
      if (savedNotifs) {
        try { setNotificationSettings(JSON.parse(savedNotifs)) } catch {}
      }
    }
  }, [])

  // Save Health Profile
  const handleSaveHealthProfile = async () => {
    setSavingHealth(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('caresphere_health_profile', JSON.stringify(healthProfile))
    }
    // Simulate API update
    await new Promise((r) => setTimeout(r, 600))
    setSavingHealth(false)
    setHealthSaved(true)
    setTimeout(() => setHealthSaved(false), 2500)
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleCondition = (cond: string) => {
    setHealthProfile((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(cond)
        ? prev.conditions.filter((c) => c !== cond)
        : [...prev.conditions, cond],
    }))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">Profile & Settings</h2>
        <p className="section-subtitle">Manage your health preferences, notifications, and security</p>
      </div>

      {/* User Account Card */}
      <div className="card p-6 flex items-center gap-5 border border-gray-100 shadow-soft">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-woman-100 to-rose-100 flex items-center justify-center shadow-2xs flex-shrink-0">
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-woman-100 text-woman-700 text-xs font-semibold mt-2 shadow-2xs">
            <Sparkles className="w-3 h-3 text-woman-600" /> Women&apos;s Health Platform
          </div>
        </div>
      </div>

      {/* Interactive Settings Navigation Tiles */}
      <div className="space-y-3">
        {/* 1. Health Profile Tile */}
        <button
          type="button"
          onClick={() => setActiveModal('health')}
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-gray-100 hover:border-woman-200"
          id="health-profile-tile-btn"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-woman-50 to-rose-50 border border-woman-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Heart className="w-5 h-5 text-woman-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                Health Profile
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-woman-100 text-woman-700">
                  {healthProfile.cycleLength}d Cycle · {healthProfile.dailyWaterTarget}ml Goal
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">
                Update menstrual cycle parameters, conditions, and hydration targets
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-woman-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        {/* 2. Notifications Tile */}
        <button
          type="button"
          onClick={() => setActiveModal('notifications')}
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-gray-100 hover:border-woman-200"
          id="notifications-tile-btn"
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
                View all recent meal, water & cycle alerts + configure notification toggles
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-woman-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        {/* 3. Privacy & Sharing Tile */}
        <Link
          href="/woman/loved-ones"
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-gray-100 hover:border-woman-200"
          id="privacy-sharing-tile-btn"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900">Privacy & Loved Ones Sharing</div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">
                Manage partner connections and category-by-category permissions in real time
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-woman-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </Link>

        {/* 4. Health Disclaimer Tile */}
        <button
          type="button"
          onClick={() => setActiveModal('disclaimer')}
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-gray-100 hover:border-woman-200"
          id="health-disclaimer-tile-btn"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900">Health Disclaimer & Safety Policy</div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">
                Read our clinical safety standards, emergency protocols & privacy pledges
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-woman-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        {/* 5. Log Out Tile */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full card-hover p-5 flex items-center justify-between gap-4 group text-left border border-red-100 hover:border-red-300 hover:bg-red-50/40 transition-all"
          id="logout-tile-btn"
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
                Safely sign out from all profile pages and end active session
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>
      </div>

      {/* Footer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
        <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Medical Notice:</strong> CareSphere is an evidence-based educational wellness companion. It is not a diagnostic device or a substitute for clinical medical evaluation.
        </span>
      </div>

      {/* ================= MODAL 1: HEALTH PROFILE ================= */}
      {activeModal === 'health' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveModal(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] z-10 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 flex-shrink-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center text-white shadow-sm">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">Your Health Profile</h3>
                  <p className="text-xs text-gray-400">Personalize your hormonal cycle & wellness metrics</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="overflow-y-auto space-y-4 pr-1 flex-1 scrollbar-thin">
              {/* Cycle Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-bold text-gray-700">Average Cycle (Days)</label>
                  <input
                    type="number"
                    min={20}
                    max={45}
                    className="input text-sm"
                    value={healthProfile.cycleLength}
                    onChange={(e) => setHealthProfile({ ...healthProfile, cycleLength: parseInt(e.target.value) || 28 })}
                  />
                  <span className="text-[10px] text-gray-400">Standard: 28 days</span>
                </div>
                <div>
                  <label className="label text-xs font-bold text-gray-700">Period Length (Days)</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    className="input text-sm"
                    value={healthProfile.periodDuration}
                    onChange={(e) => setHealthProfile({ ...healthProfile, periodDuration: parseInt(e.target.value) || 5 })}
                  />
                  <span className="text-[10px] text-gray-400">Typical: 4–7 days</span>
                </div>
              </div>

              {/* Conditions Tracked */}
              <div>
                <label className="label text-xs font-bold text-gray-700">Health Focus Areas & Conditions</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { key: 'pcos_pcod', label: 'PCOS / PCOD Focus', emoji: '🧬' },
                    { key: 'uti_prone', label: 'UTI Sensitivity', emoji: '🚽' },
                    { key: 'cramps_heavy', label: 'Dysmenorrhea / Cramps', emoji: '🩸' },
                    { key: 'hormone_metabolic', label: 'Metabolic / Blood Sugar', emoji: '🥗' },
                  ].map((c) => {
                    const selected = healthProfile.conditions.includes(c.key)
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => toggleCondition(c.key)}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-2xl text-xs font-semibold border transition-all text-left',
                          selected
                            ? 'bg-woman-50 border-woman-300 text-woman-800 ring-1 ring-woman-300'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        )}
                      >
                        <span>{c.emoji}</span>
                        <span className="truncate">{c.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Daily Hydration & Sleep */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-bold text-gray-700">Daily Water Target (ml)</label>
                  <input
                    type="number"
                    step={100}
                    min={1000}
                    max={4000}
                    className="input text-sm"
                    value={healthProfile.dailyWaterTarget}
                    onChange={(e) => setHealthProfile({ ...healthProfile, dailyWaterTarget: parseInt(e.target.value) || 2000 })}
                  />
                </div>
                <div>
                  <label className="label text-xs font-bold text-gray-700">Sleep Goal (Hours)</label>
                  <input
                    type="number"
                    step={0.5}
                    min={5}
                    max={12}
                    className="input text-sm"
                    value={healthProfile.sleepHours}
                    onChange={(e) => setHealthProfile({ ...healthProfile, sleepHours: parseFloat(e.target.value) || 7.5 })}
                  />
                </div>
              </div>

              {/* Stress Level */}
              <div>
                <label className="label text-xs font-bold text-gray-700">Baseline Stress Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Moderate', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setHealthProfile({ ...healthProfile, stressLevel: lvl })}
                      className={cn(
                        'py-2 rounded-xl text-xs font-semibold border transition-all',
                        healthProfile.stressLevel === lvl
                          ? 'bg-woman-100 border-woman-400 text-woman-800 ring-1 ring-woman-300'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex gap-2.5 pt-3.5 border-t border-gray-100 flex-shrink-0 mt-2">
              <button
                type="button"
                className="btn btn-secondary flex-1 py-2.5 text-xs font-semibold rounded-xl"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary-woman flex-1 py-2.5 text-xs font-semibold rounded-xl shadow-md"
                onClick={handleSaveHealthProfile}
                disabled={savingHealth}
                id="save-health-profile-btn"
              >
                {healthSaved ? (
                  <><Check className="w-4 h-4" /> Profile Updated!</>
                ) : savingHealth ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <><Heart className="w-4 h-4" /> Save Profile</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: NOTIFICATIONS CENTER ================= */}
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
                  <p className="text-xs text-gray-400">All recent alerts and schedule preferences</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Notifications List + Settings */}
            <div className="overflow-y-auto space-y-4 pr-1 flex-1 scrollbar-thin">
              {/* Notification Toggles */}
              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2.5">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Alert Preferences</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'waterAlerts', label: '💧 Hydration Prompts' },
                    { key: 'foodReminders', label: '🥗 Meal Reminders' },
                    { key: 'cycleUpdates', label: '🌸 Cycle Phase Tips' },
                    { key: 'partnerAlerts', label: '🔒 Partner Syncs' },
                  ].map((p) => {
                    const enabled = (notificationSettings as any)[p.key]
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => {
                          const updated = { ...notificationSettings, [p.key]: !enabled }
                          setNotificationSettings(updated)
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('caresphere_notif_prefs', JSON.stringify(updated))
                          }
                        }}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-left font-semibold',
                          enabled
                            ? 'bg-white border-amber-300 text-amber-900 shadow-2xs'
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                        )}
                      >
                        <span className="truncate">{p.label}</span>
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.2 rounded-full', enabled ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-500')}>
                          {enabled ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Notification History Header */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Recent Activity & Logs</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-semibold text-woman-600 hover:text-woman-700"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notification Cards */}
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

            {/* Fixed Footer */}
            <div className="flex gap-2.5 pt-3.5 border-t border-gray-100 flex-shrink-0 mt-2">
              <button
                type="button"
                className="btn btn-primary-woman w-full py-2.5 text-xs font-semibold rounded-xl shadow-md"
                onClick={() => setActiveModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: HEALTH DISCLAIMER ================= */}
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

            {/* Scrollable Disclaimer Content */}
            <div className="overflow-y-auto space-y-3.5 pr-1 flex-1 scrollbar-thin text-xs text-gray-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Evidence-Based Wellness Education:</strong> CareSphere synthesizes peer-reviewed clinical guidelines, urological protocols, and nutritional science to empower proactive health understanding.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-xs">1. Not a Substitute for Medical Advice</h4>
                <p>
                  CareSphere does not provide formal medical diagnoses, write prescriptions, or offer personalized treatment plans. Always consult a qualified physician or healthcare provider for clinical evaluation.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-xs">2. Emergency Symptoms & Red Flags</h4>
                <p>
                  If you experience high fever (&gt;38.5°C / 101.3°F), severe flank/lower-back pain, visible blood in urine (hematuria), chills, or severe vomiting, seek immediate medical attention or visit the nearest emergency department.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-xs">3. Privacy & Telemetry Standards</h4>
                <p>
                  Your cycle, hydration, and symptom logs are confidential and encrypted. Shared data with Loved Ones is strictly consent-driven and can be revoked at any time.
                </p>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex gap-2.5 pt-3.5 border-t border-gray-100 flex-shrink-0 mt-2">
              <button
                type="button"
                className="btn btn-primary-woman w-full py-2.5 text-xs font-semibold rounded-xl shadow-md"
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
