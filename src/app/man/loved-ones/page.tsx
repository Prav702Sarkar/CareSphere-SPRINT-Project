'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users, Lock, Eye, EyeOff, Shield, Check, ArrowRight,
  RefreshCw, Sparkles, LogOut, Droplets, Calendar, AlertCircle, Copy, CheckCircle2, QrCode,
  Heart, Activity, Apple, Zap, Moon, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PartnerData {
  partnerName: string
  partnerEmail?: string
  connectionCode?: string
  relationship?: string
  status: 'pending' | 'approved' | 'disconnected'
  verifiedAt: string
  allowedCategories: string[]
  liveData?: {
    cycleStatus?: {
      cycleDay?: number
      estimatedPhase?: string
      lastRecordedPeriod?: string | null
      cycleLength?: number
    }
    periodDates?: {
      lastPeriodStart?: string | null
      periodDuration?: number
      flow?: string
      cramps?: string
      isRegular?: boolean
    }
    hydration?: {
      todayTotalMl: number
      goalMl: number
      percentage: number
      goalReached: boolean
    }
    utiInfo?: {
      recentUTISymptoms: any[]
      status?: string
      lastChecked?: string
    }
    symptoms?: Array<{
      symptom_name: string
      category: string
      severity: string
      notes?: string
      logged_at: string
    }>
    pcosPcod?: {
      conditions: string[]
      concerns: string[]
      stressLevel?: number
      sleepHours?: number
    }
    nutrition?: {
      dietaryType: string
      restrictions: string[]
      goals: string[]
    }
    insights?: Array<{
      type: string
      title: string
      body: string
    }>
  }
}

export default function ManLovedOnesPage() {
  const [myCode, setMyCode] = useState<string>('CARE-....')
  const [copied, setCopied] = useState(false)
  const [partnerCodeInput, setPartnerCodeInput] = useState('')
  const [partner, setPartner] = useState<PartnerData | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // 1. Fetch live shared data directly from server
  const fetchSharedData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const res = await fetch('/api/partner/shared-data', { cache: 'no-store' }).catch(() => null)
      if (res && res.ok) {
        const json = await res.json()
        if (json.success && json.status === 'approved') {
          const updated: PartnerData = {
            partnerName: json.partnerName || 'Partner',
            partnerEmail: json.partnerEmail,
            relationship: json.relationship || 'partner',
            status: 'approved',
            verifiedAt: new Date().toISOString(),
            allowedCategories: json.allowedCategories || [],
            liveData: json.data || {},
          }
          setPartner(updated)
          if (typeof window !== 'undefined') {
            localStorage.setItem('caresphere_man_partner', JSON.stringify(updated))
          }
        } else if (json.status === 'pending') {
          setPartner((prev) => ({
            partnerName: json.partnerName || prev?.partnerName || 'Partner',
            partnerEmail: json.partnerEmail || prev?.partnerEmail,
            status: 'pending',
            verifiedAt: new Date().toISOString(),
            allowedCategories: [],
          }))
        } else if (json.status === 'disconnected') {
          // If server says disconnected and no manual override
          setPartner(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('caresphere_man_partner')
          }
        }
      }
    } finally {
      if (isManual) setRefreshing(false)
    }
  }, [])

  // 2. Fetch connection code and initial sync on mount
  useEffect(() => {
    let isMounted = true

    async function init() {
      try {
        const res = await fetch('/api/partner/code').catch(() => null)
        if (res && res.ok && isMounted) {
          const json = await res.json()
          if (json.code) setMyCode(json.code)
        }
      } catch (err) {
        console.warn('[Fetch Code Error]:', err)
      }

      // Check server for real-time connection
      await fetchSharedData(false)
    }

    init()

    // Real-time polling every 12 seconds to keep partner data automatically fresh
    const interval = setInterval(() => {
      fetchSharedData(false)
    }, 12000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [fetchSharedData])

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(myCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Connect via Her Connection Code
  const handleConnectWithCode = async () => {
    if (!partnerCodeInput.trim()) return
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/partner/code/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: partnerCodeInput.trim(),
          relationship: 'partner',
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to connect with code')
      }

      const newPartnerState: PartnerData = {
        partnerName: json.partner?.name || 'Partner',
        partnerEmail: json.partner?.email,
        connectionCode: partnerCodeInput.trim().toUpperCase(),
        status: json.status || 'pending',
        verifiedAt: new Date().toISOString(),
        allowedCategories: json.partner?.permissions || [],
        liveData: {},
      }

      setPartner(newPartnerState)
      if (typeof window !== 'undefined') {
        localStorage.setItem('caresphere_man_partner', JSON.stringify(newPartnerState))
      }

      setSuccessMsg(json.message || 'Connection request sent successfully! Waiting for her approval.')
      setPartnerCodeInput('')

      // Immediately poll shared data
      setTimeout(() => fetchSharedData(false), 800)
    } catch (err: any) {
      setError(err.message || 'Could not connect with code')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect from this partner view?')) {
      setPartner(null)
      setError(null)
      setSuccessMsg(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('caresphere_man_partner')
      }
      await fetch('/api/partner/request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: partner?.partnerEmail || 'disconnect', status: 'revoked' }),
      }).catch(() => null)
    }
  }

  const allowedCategories = partner?.allowedCategories || []
  const hasApprovedPartner = partner && partner.status === 'approved'

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h2 className="section-title">Partner Access & Loved Ones</h2>
        <p className="section-subtitle">Real-time health insights shared with consent from your partner</p>
      </div>

      {/* Code Generation Card */}
      <div className="card p-6 sm:p-7 border-2 border-man-200 bg-gradient-to-br from-white via-man-50/40 to-teal-50/30 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-man-100 text-man-800 text-[11px] font-bold">
              <QrCode className="w-3.5 h-3.5" /> Your Personal Connection Code
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">
              Share This Code With Her
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Give this code to your partner. When she enters it on her dashboard, she will grant permission to view selected logs.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border-2 border-man-400 shadow-sm">
              <span className="font-mono text-2xl font-black text-man-700 tracking-wider">
                {myCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className={cn(
                  'btn btn-sm px-3 py-1.5 text-xs font-semibold rounded-xl transition-all',
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'btn-primary-man'
                )}
                id="copy-code-btn"
              >
                {copied ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </span>
                )}
              </button>
            </div>
            <span className="text-[10px] text-gray-400">100% Consent-Driven Connection</span>
          </div>
        </div>
      </div>

      {/* Main Connection Area */}
      {!hasApprovedPartner ? (
        partner?.status === 'pending' ? (
          /* Pending Approval State */
          <div className="card p-6 sm:p-7 text-center space-y-4 border-2 border-amber-200 bg-amber-50/40 rounded-3xl animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Waiting for {partner.partnerName}&apos;s Approval
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                Your connection request has been received on her CareSphere profile. Once she accepts and chooses the health logs to share, her live data will appear here automatically!
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => fetchSharedData(true)}
                disabled={refreshing}
                className="btn btn-primary-man btn-sm text-xs"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
                {refreshing ? 'Checking...' : 'Check Status Now'}
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                className="btn btn-secondary btn-sm text-xs"
              >
                Cancel Request
              </button>
            </div>
          </div>
        ) : (
          /* Not Connected Form */
          <div className="card p-6 sm:p-7 space-y-6 border border-gray-100 shadow-soft">
            <div>
              <h3 className="font-bold text-base text-gray-900 mb-1">
                Have Her Connection Code?
              </h3>
              <p className="text-xs text-gray-500">
                Alternatively, enter her 6-character code here to send a connection request directly to her profile.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="input uppercase tracking-wider font-mono text-sm py-3 px-4 font-bold"
                  placeholder="e.g. CARE-9382"
                  value={partnerCodeInput}
                  onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())}
                  id="partner-code-input"
                />
              </div>
              <button
                type="button"
                className="btn btn-primary-man py-3 px-6 text-xs font-semibold rounded-xl shadow-md min-w-[150px]"
                onClick={handleConnectWithCode}
                disabled={!partnerCodeInput.trim() || loading}
                id="connect-code-btn"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    Connect Code <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs text-gray-600 space-y-2">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-man-600" /> How Code-Based Connection Works:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-gray-500 leading-relaxed text-[11px]">
                <li>Share your <strong>{myCode}</strong> code with your partner.</li>
                <li>She enters your code in her <strong>Loved Ones</strong> portal.</li>
                <li>She selects which categories to share (Cycle, Hydration, UTI, Symptoms, etc.).</li>
                <li>Her permitted health data will appear live here in real time!</li>
              </ol>
            </div>
          </div>
        )
      ) : (
        /* ================= ACTIVE CONNECTED PARTNER VIEW ================= */
        <div className="space-y-6 animate-scale-in">
          {/* Top Status Header */}
          <div className="card p-6 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                  {partner.partnerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900">{partner.partnerName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Connected
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {allowedCategories.length} health categories currently shared by her
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => fetchSharedData(true)}
                  disabled={refreshing}
                  className="btn btn-sm btn-secondary text-xs shadow-2xs font-semibold"
                  title="Refresh live data"
                >
                  <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
                  {refreshing ? 'Refreshing...' : 'Refresh Logs'}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="btn btn-sm text-xs text-red-600 hover:bg-red-50 border-red-200"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>

          {/* If No Categories Selected Yet */}
          {allowedCategories.length === 0 && (
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-2">
              <Info className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="font-bold text-amber-900 text-sm">No Categories Toggled Yet</h4>
              <p className="text-xs text-amber-700 max-w-md mx-auto">
                {partner.partnerName} is connected! Once she toggles on categories (Cycle, Hydration, UTI, Nutrition) on her dashboard, they will display live here.
              </p>
            </div>
          )}

          {/* ================= ALL 8 REAL-TIME HEALTH CATEGORY WIDGETS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. 🌸 Cycle Status */}
            {allowedCategories.includes('cycle_status') && (
              <div className="card p-5 border border-rose-200 bg-rose-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    Cycle Status & Phase
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    Day {partner.liveData?.cycleStatus?.cycleDay || 1}
                  </span>
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-gray-900">
                    {partner.liveData?.cycleStatus?.estimatedPhase || 'Follicular Phase'}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Last recorded period: {partner.liveData?.cycleStatus?.lastRecordedPeriod || 'Recently logged'}
                  </p>
                </div>
              </div>
            )}

            {/* 2. 🩸 Period Dates */}
            {allowedCategories.includes('period_dates') && (
              <div className="card p-5 border border-red-200 bg-red-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                    <Heart className="w-4 h-4 text-red-500 fill-red-400" />
                    Period Logs
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                    {partner.liveData?.periodDates?.isRegular ? 'Regular Cycle' : 'Variation noted'}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-semibold">{partner.liveData?.periodDates?.periodDuration || 5} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flow:</span>
                    <span className="font-semibold capitalize">{partner.liveData?.periodDates?.flow || 'Moderate'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Comfort:</span>
                    <span className="font-semibold capitalize">{partner.liveData?.periodDates?.cramps || 'Mild cramps'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 💧 Hydration Status */}
            {allowedCategories.includes('hydration') && (
              <div className="card p-5 border border-teal-200 bg-teal-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                    <Droplets className="w-4 h-4 text-teal-500" />
                    Daily Hydration
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {partner.liveData?.hydration?.percentage || 70}% of Goal
                  </span>
                </div>
                <div>
                  <div className="font-display text-2xl font-black text-gray-900">
                    {partner.liveData?.hydration?.todayTotalMl || 1500} <span className="text-sm font-normal text-gray-500">/ {partner.liveData?.hydration?.goalMl || 2000} ml</span>
                  </div>
                  <div className="w-full bg-teal-100 rounded-full h-2 mt-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${partner.liveData?.hydration?.percentage || 70}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. 🚽 UTI Information */}
            {allowedCategories.includes('uti_information') && (
              <div className="card p-5 border border-indigo-200 bg-indigo-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    UTI Prevention & Awareness
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    {partner.liveData?.utiInfo?.status || 'Optimal'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1.5">
                  <p className="leading-relaxed">
                    {partner.liveData?.utiInfo?.recentUTISymptoms && partner.liveData.utiInfo.recentUTISymptoms.length > 0
                      ? `Recent attention items: ${partner.liveData.utiInfo.recentUTISymptoms.map((s: any) => s.symptom_name).join(', ')}`
                      : 'No acute UTI discomfort recorded. Good preventative hydration habits active.'}
                  </p>
                </div>
              </div>
            )}

            {/* 5. 🩺 Selected Symptoms */}
            {allowedCategories.includes('selected_symptoms') && (
              <div className="card p-5 border border-amber-200 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <Activity className="w-4 h-4 text-amber-500" />
                    Recent Symptoms
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Logged Updates
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {partner.liveData?.symptoms && partner.liveData.symptoms.length > 0 ? (
                    partner.liveData.symptoms.map((sym, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-amber-900 font-semibold shadow-2xs"
                      >
                        {sym.symptom_name} <span className="text-[10px] opacity-60">({sym.severity})</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No elevated discomfort logged today</span>
                  )}
                </div>
              </div>
            )}

            {/* 6. 🧬 PCOS / PCOD Details */}
            {allowedCategories.includes('pcos_pcod_details') && (
              <div className="card p-5 border border-purple-200 bg-purple-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
                    <Zap className="w-4 h-4 text-purple-500" />
                    Hormonal / PCOS Balance
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Wellness
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sleep target:</span>
                    <span className="font-semibold">{partner.liveData?.pcosPcod?.sleepHours || 7.5} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stress support:</span>
                    <span className="font-semibold">Level {partner.liveData?.pcosPcod?.stressLevel || 4}/10</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. 🥗 Nutrition Plan */}
            {allowedCategories.includes('nutrition_plan') && (
              <div className="card p-5 border border-emerald-200 bg-emerald-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <Apple className="w-4 h-4 text-emerald-500" />
                    Nutrition & Diet
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {partner.liveData?.nutrition?.dietaryType || 'Balanced'}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Focus goals: </span>
                  {partner.liveData?.nutrition?.goals?.join(', ') || 'Phase nourishment & hydration'}
                </div>
              </div>
            )}

            {/* 8. 📊 Selected Insights */}
            {allowedCategories.includes('selected_insights') && (
              <div className="card p-5 border border-blue-200 bg-blue-50/30 space-y-3 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Support Tips For You
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    AI Wellness Summary
                  </span>
                </div>
                <div className="space-y-2">
                  {partner.liveData?.insights?.map((ins, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-2xl border border-blue-100 text-xs">
                      <div className="font-bold text-gray-900">{ins.title}</div>
                      <div className="text-gray-600 mt-0.5">{ins.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
