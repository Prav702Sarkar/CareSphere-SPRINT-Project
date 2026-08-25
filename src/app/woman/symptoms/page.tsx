'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Plus, Clock, TrendingUp, Filter, X, AlertCircle, ChevronDown, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SymptomCategory, SymptomSeverity } from '@/types'

const SYMPTOM_CATEGORIES: { value: SymptomCategory; label: string; emoji: string }[] = [
  { value: 'menstrual', label: 'Menstrual', emoji: '🌸' },
  { value: 'uti', label: 'UTI', emoji: '💧' },
  { value: 'pcos_pcod', label: 'PCOS/PCOD', emoji: '🔬' },
  { value: 'digestive', label: 'Digestive', emoji: '🫁' },
  { value: 'emotional', label: 'Emotional', emoji: '💭' },
  { value: 'physical', label: 'Physical', emoji: '💪' },
  { value: 'other', label: 'Other', emoji: '📝' },
]

const COMMON_SYMPTOMS: Record<SymptomCategory, string[]> = {
  menstrual: ['Cramps', 'Heavy bleeding', 'Spotting', 'Bloating', 'Breast tenderness', 'Back pain'],
  uti: ['Burning sensation', 'Frequent urination', 'Cloudy urine', 'Pelvic pressure', 'Strong urine odor'],
  pcos_pcod: ['Irregular periods', 'Acne', 'Facial hair', 'Weight gain', 'Hair thinning', 'Mood changes'],
  digestive: ['Nausea', 'Constipation', 'Diarrhea', 'Stomach pain', 'Gas & bloating'],
  emotional: ['Mood swings', 'Anxiety', 'Irritability', 'Low energy', 'Brain fog', 'Depression'],
  physical: ['Fatigue', 'Headache', 'Joint pain', 'Back pain', 'Dizziness', 'Sleep issues'],
  other: [],
}

const SEVERITIES: { value: SymptomSeverity; label: string; color: string }[] = [
  { value: 'mild', label: 'Mild', color: 'bg-green-100 border-green-300 text-green-700' },
  { value: 'moderate', label: 'Moderate', color: 'bg-amber-100 border-amber-300 text-amber-700' },
  { value: 'severe', label: 'Severe', color: 'bg-red-100 border-red-300 text-red-700' },
]

function SeverityBadge({ severity }: { severity: SymptomSeverity }) {
  const s = SEVERITIES.find((s) => s.value === severity) || SEVERITIES[0]
  return <span className={cn('badge border', s.color)}>{s.label}</span>
}

function CategoryBadge({ category }: { category: SymptomCategory }) {
  const c = SYMPTOM_CATEGORIES.find((c) => c.value === category) || SYMPTOM_CATEGORIES[0]
  return (
    <span className="badge bg-woman-100 text-woman-700">
      {c.emoji} {c.label}
    </span>
  )
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function LogSymptomForm({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (newSymptom: any) => void
}) {
  const [category, setCategory] = useState<SymptomCategory>('menstrual')
  const [symptomName, setSymptomName] = useState('')
  const [customName, setCustomName] = useState('')
  const [severity, setSeverity] = useState<SymptomSeverity>('mild')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const suggestions = COMMON_SYMPTOMS[category]

  const handleSubmit = async () => {
    const name = symptomName || customName
    if (!name) return
    setLoading(true)

    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptomName: name,
          category,
          severity,
          durationHours: duration ? parseFloat(duration) : undefined,
          notes: notes || undefined,
        }),
      })

      const newLog = {
        id: 'sym_' + Date.now(),
        symptom_name: name,
        category,
        severity,
        notes,
        logged_at: new Date().toISOString(),
      }

      onSave(newLog)
      onClose()
    } catch (err) {
      console.warn('[Log Symptom Error]:', err)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-lg shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-gray-900">Log a Symptom</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="label">Category</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SYMPTOM_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => { setCategory(c.value); setSymptomName('') }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                  category === c.value
                    ? 'bg-woman-100 border-woman-400 text-woman-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Common symptoms */}
        {suggestions.length > 0 && (
          <div className="mb-5">
            <label className="label">Common symptoms</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSymptomName(s)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                    symptomName === s
                      ? 'bg-rose-100 border-rose-400 text-rose-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {symptomName === s && '✓ '}{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom name */}
        {!symptomName && (
          <div className="mb-5">
            <label className="label" htmlFor="custom-symptom">Or describe your symptom</label>
            <input
              id="custom-symptom"
              className="input"
              placeholder="Describe your symptom..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
        )}

        {/* Severity */}
        <div className="mb-5">
          <label className="label">Severity</label>
          <div className="flex gap-2 mt-1">
            {SEVERITIES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSeverity(s.value)}
                className={cn(
                  'flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all',
                  severity === s.value ? s.color : 'bg-white border-gray-200 text-gray-600'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-5">
          <label className="label" htmlFor="duration">Duration (hours, optional)</label>
          <input
            id="duration"
            type="number"
            min={0.5}
            step={0.5}
            className="input"
            placeholder="e.g. 2"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="label" htmlFor="symptom-notes">Notes (optional)</label>
          <textarea
            id="symptom-notes"
            className="input resize-none h-20"
            placeholder="Any additional observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* UTI escalation warning */}
        {category === 'uti' && severity === 'severe' && (
          <div className="mb-4 alert-warning">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">Severe UTI symptoms may require prompt medical attention. Consider consulting a healthcare professional.</span>
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary-woman flex-1"
            onClick={handleSubmit}
            disabled={(!symptomName && !customName) || loading}
            id="save-symptom-btn"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : 'Save Symptom'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SymptomsPage() {
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<SymptomCategory | 'all'>('all')
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadSymptoms() {
      try {
        const res = await fetch('/api/symptoms', { cache: 'no-store' }).catch(() => null)
        if (res && res.ok && isMounted) {
          const data = await res.json()
          if (data.symptoms) {
            setLogs(data.symptoms)
          }
        }
      } catch (err) {
        console.warn('[Fetch Symptoms Error]:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadSymptoms()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = filterCategory === 'all'
    ? logs
    : logs.filter((l) => l.category === filterCategory)

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Symptoms</h2>
          <p className="section-subtitle">Track and monitor your health symptoms over time</p>
        </div>
        <button
          className="btn btn-primary-woman"
          onClick={() => setShowForm(true)}
          id="log-symptom-btn"
        >
          <Plus className="w-4 h-4" />
          Log Symptom
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Logged Entries', value: String(logs.length), icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Most recent', value: logs[0]?.symptom_name || logs[0]?.symptomName || 'None', icon: TrendingUp, color: 'text-woman-500', bg: 'bg-woman-50' },
          { label: 'Severity', value: logs[0]?.severity ? logs[0].severity.toUpperCase() : 'Optimal', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2', stat.bg)}>
              <stat.icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <div className="font-display font-bold text-gray-900 text-lg truncate px-1">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Filter by category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              filterCategory === 'all'
                ? 'bg-woman-100 border-woman-400 text-woman-700'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            All
          </button>
          {SYMPTOM_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilterCategory(c.value)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                filterCategory === c.value
                  ? 'bg-woman-100 border-woman-400 text-woman-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log history */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">Recent Logs</h3>
        {loading ? (
          <div className="card p-8 text-center text-xs text-gray-400">Loading symptom records...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 sm:p-10 text-center space-y-3 border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">No symptoms logged yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-0.5">
                Record discomfort, cramps, UTI awareness, or wellness notes to track health patterns over time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="btn btn-primary-woman btn-sm text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Log First Symptom
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((log) => (
              <div key={log.id} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
                    {SYMPTOM_CATEGORIES.find((c) => c.value === log.category)?.emoji || '📝'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{log.symptom_name || log.symptomName}</div>
                    {log.notes && <div className="text-xs text-gray-400 mt-0.5">{log.notes}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <SeverityBadge severity={log.severity} />
                  <span className="text-xs text-gray-400">{timeAgo(log.logged_at || log.loggedAt || new Date().toISOString())}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Educational Banner */}
      <div className="card p-5 border-l-4 border-l-woman-500 bg-woman-50/50 flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-woman-900 text-sm">Understand your symptoms</div>
          <div className="text-xs text-woman-700 mt-0.5">Learn when symptoms may indicate an underlying condition like PCOS or a UTI</div>
        </div>
        <Link href="/woman/education" className="btn btn-primary-woman btn-sm flex-shrink-0">
          <BookOpen className="w-4 h-4" />
          Learn
        </Link>
      </div>

      {showForm && (
        <LogSymptomForm
          onClose={() => setShowForm(false)}
          onSave={(newSym) => setLogs((prev) => [newSym, ...prev])}
        />
      )}
    </div>
  )
}
