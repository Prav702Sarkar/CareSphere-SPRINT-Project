'use client'

import { useState, useEffect } from 'react'
import {
  Users, Plus, Eye, EyeOff, Check, X, Lock, ChevronRight, Shield, Heart,
  UserCheck, Trash2, Sparkles, RefreshCw, AlertCircle, CheckCircle2, QrCode, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SharedDataCategory } from '@/types'

const CATEGORIES: { key: SharedDataCategory; label: string; desc: string; icon: string }[] = [
  { key: 'cycle_status', label: 'Cycle Status', desc: 'Current cycle phase, day, and estimated window', icon: '🌸' },
  { key: 'period_dates', label: 'Period Dates', desc: 'Period start, end, and duration logs', icon: '🩸' },
  { key: 'uti_information', label: 'UTI Information', desc: 'Symptom status and preventative logs', icon: '🚽' },
  { key: 'pcos_pcod_details', label: 'PCOS/PCOD Details', desc: 'Hormonal and lifestyle management data', icon: '🧬' },
  { key: 'nutrition_plan', label: 'Nutrition Plan', desc: 'Phase-aligned meal logs & preferences', icon: '🥗' },
  { key: 'hydration', label: 'Hydration', desc: 'Daily water intake and progress ring', icon: '💧' },
  { key: 'selected_symptoms', label: 'Selected Symptoms', desc: 'Logged symptoms and comfort notes', icon: '🩺' },
  { key: 'selected_insights', label: 'Selected Insights', desc: 'Trend summaries & health reports', icon: '📊' },
]

export interface Connection {
  id: string
  name: string
  email?: string
  relationship: string
  status: 'approved' | 'pending'
  permissions: SharedDataCategory[]
  createdAt: string
}

export interface AccessRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterEmail?: string
  relationship?: string
  permissions: SharedDataCategory[]
  createdAt: string
}

function PermissionToggle({
  category,
  allowed,
  onToggle,
}: {
  category: (typeof CATEGORIES)[0]
  allowed: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-100">
      <div className="flex items-center gap-3 min-w-0 mr-3 flex-1">
        <span className="text-xl flex-shrink-0">{category.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            {category.label}
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full',
              allowed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
            )}>
              {allowed ? 'Shared' : 'Hidden'}
            </span>
          </div>
          <div className="text-xs text-gray-400 truncate mt-0.5">{category.desc}</div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {allowed ? (
          <Eye className="w-4 h-4 text-emerald-500" />
        ) : (
          <EyeOff className="w-4 h-4 text-gray-300" />
        )}
        <button
          type="button"
          onClick={onToggle}
          role="switch"
          aria-checked={allowed}
          aria-label={`Toggle ${category.label} sharing`}
          className={cn(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-woman-400 focus:ring-offset-2',
            allowed ? 'bg-gradient-to-r from-woman-600 to-rose-500 shadow-sm' : 'bg-gray-300'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
              allowed ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>
    </div>
  )
}

// Modal: Connect Partner with Code
function ConnectCodeModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (newConn: Connection) => void
}) {
  const [code, setCode] = useState('')
  const [relationship, setRelationship] = useState('partner')
  const [permissions, setPermissions] = useState<SharedDataCategory[]>([
    'cycle_status',
    'hydration',
    'uti_information',
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePerm = (cat: SharedDataCategory) => {
    setPermissions((prev) =>
      prev.includes(cat) ? prev.filter((p) => p !== cat) : [...prev, cat]
    )
  }

  const handleConnect = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/partner/code/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          relationship,
          permissions,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to connect with code')
      }

      const newConn: Connection = {
        id: json.partner?.id || 'conn_' + Date.now(),
        name: json.partner?.name || 'Partner',
        email: json.partner?.email,
        relationship,
        status: 'approved',
        permissions,
        createdAt: new Date().toISOString(),
      }

      onSuccess(newConn)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Could not connect with code')
    } finally {
      setLoading(false)
    }
  }

  const relationships = [
    { key: 'partner', label: 'Partner', emoji: '❤️', activeClass: 'border-rose-400 bg-rose-50/90 text-rose-800' },
    { key: 'parent', label: 'Parent', emoji: '👨‍👩‍👧', activeClass: 'border-amber-400 bg-amber-50/90 text-amber-800' },
    { key: 'sibling', label: 'Sibling', emoji: '🤝', activeClass: 'border-blue-400 bg-blue-50/90 text-blue-800' },
    { key: 'other', label: 'Other', emoji: '✨', activeClass: 'border-purple-400 bg-purple-50/90 text-purple-800' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] z-10 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 flex-shrink-0 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center shadow-md text-white flex-shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 leading-snug">Connect Loved One via Code</h3>
              <p className="text-[11px] text-gray-400">Enter their 6-character connection code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 scrollbar-thin text-xs">
          <div>
            <label className="label text-[11px] font-bold text-gray-700" htmlFor="partner-code">
              Partner&apos;s Connection Code <span className="text-rose-500">*</span>
            </label>
            <input
              id="partner-code"
              type="text"
              className="input uppercase tracking-wider font-mono font-bold text-sm py-2.5 px-3"
              placeholder="e.g. CARE-9382"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoFocus
            />
          </div>

          <div>
            <label className="label text-[11px] font-bold text-gray-700">Relationship</label>
            <div className="grid grid-cols-4 gap-1.5">
              {relationships.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRelationship(r.key)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all',
                    relationship === r.key
                      ? cn('shadow-xs ring-2 ring-offset-1', r.activeClass, 'ring-woman-300')
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <span className="text-sm">{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Initial Permissions Selector */}
          <div className="space-y-2">
            <div className="label text-[11px] font-bold text-gray-700">Categories to Share with Him:</div>
            <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
              {CATEGORIES.slice(0, 4).map((cat) => {
                const isAllowed = permissions.includes(cat.key)
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => togglePerm(cat.key)}
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-xl border text-left font-semibold transition-all',
                      isAllowed
                        ? 'bg-white border-woman-300 text-woman-900 shadow-2xs'
                        : 'bg-transparent border-transparent text-gray-400 opacity-60'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', isAllowed ? 'bg-woman-100 text-woman-800' : 'bg-gray-200 text-gray-500')}>
                      {isAllowed ? 'Shared' : 'Hidden'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 pt-3 border-t border-gray-100 flex-shrink-0 mt-2">
          <button
            type="button"
            className="btn btn-secondary flex-1 py-2.5 text-xs font-semibold rounded-xl"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={cn(
              'btn flex-1 py-2.5 text-xs font-semibold rounded-xl shadow-md transition-all',
              code.trim()
                ? 'btn-primary-woman hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent'
            )}
            onClick={handleConnect}
            disabled={!code.trim() || loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Authorize & Connect'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LovedOnesPage() {
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [connections, setConnections] = useState<Connection[]>([])
  const [incomingRequests, setIncomingRequests] = useState<AccessRequest[]>([])
  const [myCode, setMyCode] = useState<string>('CARE-....')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1. Fetch my code & active connections on mount with real-time polling
  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        // Fetch my code
        const codeRes = await fetch('/api/partner/code', { cache: 'no-store' }).catch(() => null)
        if (codeRes && codeRes.ok && isMounted) {
          const json = await codeRes.json()
          if (json.code) setMyCode(json.code)
        }

        // Fetch requests and active connections
        const res = await fetch('/api/partner/request', { cache: 'no-store' }).catch(() => null)
        if (res && res.ok && isMounted) {
          const data = await res.json()
          if (data.incoming) setIncomingRequests(data.incoming)
          if (data.connections) {
            setConnections(data.connections)
            if (data.connections.length > 0 && !expandedId) {
              setExpandedId(data.connections[0].id)
            }
          }
        }
      } catch (err) {
        console.warn('[Loved Ones Load Warning]:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    // Auto-sync every 8 seconds
    const interval = setInterval(() => {
      loadData()
    }, 8000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [expandedId])

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(myCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Accept an incoming request
  const handleAcceptRequest = async (request: AccessRequest) => {
    try {
      const res = await fetch('/api/partner/request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          status: 'approved',
          permissions: request.permissions || ['cycle_status', 'hydration', 'uti_information'],
        }),
      })

      if (res.ok) {
        const approvedConn: Connection = {
          id: request.id,
          name: request.requesterName,
          email: request.requesterEmail,
          relationship: request.relationship || 'partner',
          status: 'approved',
          permissions: request.permissions || ['cycle_status', 'hydration', 'uti_information'],
          createdAt: new Date().toISOString(),
        }

        setConnections((prev) => [approvedConn, ...prev])
        setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id))
        setExpandedId(approvedConn.id)
      }
    } catch (err) {
      console.warn('[Accept Request Error]:', err)
    }
  }

  // Decline request
  const handleDeclineRequest = async (requestId: string) => {
    try {
      await fetch('/api/partner/request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: 'rejected' }),
      })
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId))
    } catch (err) {
      console.warn('[Decline Request Error]:', err)
    }
  }

  // Toggle category permission
  const togglePermission = async (personId: string, cat: SharedDataCategory) => {
    const updated = connections.map((conn) => {
      if (conn.id === personId) {
        const allowed = conn.permissions.includes(cat)
        const newPerms = allowed
          ? conn.permissions.filter((c) => c !== cat)
          : [...conn.permissions, cat]

        // Sync with database
        fetch('/api/partner/request', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: personId, status: 'approved', permissions: newPerms }),
        }).catch(() => null)

        return { ...conn, permissions: newPerms }
      }
      return conn
    })

    setConnections(updated)
  }

  // Revoke connection
  const handleRevoke = async (id: string, name: string) => {
    if (confirm(`Revoke all health sharing access for ${name}?`)) {
      await fetch('/api/partner/request', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, status: 'revoked' }),
      }).catch(() => null)

      setConnections((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Loved Ones & Partner Access</h2>
          <p className="section-subtitle">Manage code-based connections with 100% granular privacy control</p>
        </div>
        <button
          type="button"
          onClick={() => setShowConnectModal(true)}
          className="btn btn-primary-woman shadow-md hover:shadow-lg flex-shrink-0"
          id="connect-loved-one-btn"
        >
          <Plus className="w-4 h-4" /> Connect with Code
        </button>
      </div>

      {/* Your Connection Code Banner */}
      <div className="card p-5 sm:p-6 border-2 border-woman-200 bg-gradient-to-br from-white via-woman-50/40 to-rose-50/30 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-woman-100 text-woman-800 text-[11px] font-bold">
              <QrCode className="w-3.5 h-3.5" /> Your Personal Connection Code
            </div>
            <h3 className="font-display text-base font-bold text-gray-900">
              Let Him Connect to You
            </h3>
            <p className="text-xs text-gray-500">
              When he enters your code on his account, an access request will appear below for you to accept.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border-2 border-woman-400 shadow-sm flex-shrink-0">
            <span className="font-mono text-xl font-black text-woman-700 tracking-wider">
              {myCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className={cn(
                'btn btn-sm px-2.5 py-1 text-xs font-semibold rounded-xl transition-all',
                copied ? 'bg-emerald-600 text-white' : 'btn-primary-woman'
              )}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: INCOMING REQUESTS WAITING FOR SHE'S APPROVAL ================= */}
      {incomingRequests.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            Incoming Access Authorization Requests ({incomingRequests.length})
          </div>

          <div className="space-y-3">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="card p-5 border-2 border-amber-200 bg-amber-50/50 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
                    {req.requesterName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      {req.requesterName}
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                        {req.relationship || 'Partner'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Wants to view your permitted health records
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAcceptRequest(req)}
                    className="btn btn-primary-woman btn-sm text-xs shadow-sm font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept & Grant Access
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeclineRequest(req.id)}
                    className="btn btn-secondary btn-sm text-xs text-gray-500 hover:text-red-600"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 2: ACTIVE CONNECTIONS & CATEGORY PERMISSIONS ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Connected Loved Ones ({connections.length})
          </span>
          <span className="text-xs text-gray-400">Category-by-Category Permissions</span>
        </div>

        {connections.length === 0 ? (
          <div className="card p-8 sm:p-10 text-center space-y-4 border border-dashed border-gray-200">
            <div className="w-14 h-14 rounded-3xl bg-woman-50 flex items-center justify-center mx-auto text-woman-500">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">No loved ones connected yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Enter your partner&apos;s connection code or share your code with him to start sharing permitted wellness updates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConnectModal(true)}
              className="btn btn-primary-woman btn-sm text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Connect with Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((conn) => {
              const isExpanded = expandedId === conn.id
              const sharedCount = conn.permissions.length

              return (
                <div
                  key={conn.id}
                  className="card border border-gray-100 shadow-soft overflow-hidden transition-all"
                >
                  {/* Summary Bar */}
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : conn.id)}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-woman-500 to-rose-500 text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
                        {conn.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                          {conn.name}
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-woman-100 text-woman-800">
                            {conn.relationship}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                          <span className="text-emerald-600 font-semibold">{sharedCount} categories shared</span>
                          <span>·</span>
                          <span>100% consent control</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRevoke(conn.id, conn.name)
                        }}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Revoke access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight
                        className={cn(
                          'w-4 h-4 text-gray-400 transition-transform duration-200',
                          isExpanded && 'rotate-90 text-woman-600'
                        )}
                      />
                    </div>
                  </div>

                  {/* Expanded Permissions Drawer */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/40 p-4 sm:p-5 space-y-3 animate-fade-in">
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Configure {conn.name}&apos;s Live Visibility
                      </div>
                      <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 p-2 shadow-2xs">
                        {CATEGORIES.map((cat) => (
                          <PermissionToggle
                            key={cat.key}
                            category={cat}
                            allowed={conn.permissions.includes(cat.key)}
                            onToggle={() => togglePermission(conn.id, cat.key)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Privacy Guarantee */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Full Consent Control:</strong> Nobody can see any health record without your explicit code connection and real-time permission toggles. You can revoke access at any time.
        </span>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <ConnectCodeModal
          onClose={() => setShowConnectModal(false)}
          onSuccess={(newConn) => {
            setConnections((prev) => [newConn, ...prev])
            setExpandedId(newConn.id)
          }}
        />
      )}
    </div>
  )
}
