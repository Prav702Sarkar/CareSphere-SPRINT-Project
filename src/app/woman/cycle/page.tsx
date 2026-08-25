'use client'

import { useState, useEffect } from 'react'
import { Moon, Plus, ChevronLeft, ChevronRight, X, Droplets, Calendar as CalendarIcon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FlowLevel, MoodLevel, EnergyLevel } from '@/types'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const FLOW_OPTIONS: { value: FlowLevel; label: string; emoji: string }[] = [
  { value: 'spotting', label: 'Spotting', emoji: '🔴' },
  { value: 'light', label: 'Light', emoji: '🔴🔴' },
  { value: 'moderate', label: 'Moderate', emoji: '🔴🔴🔴' },
  { value: 'heavy', label: 'Heavy', emoji: '🔴🔴🔴🔴' },
]

const MOOD_OPTIONS: { value: MoodLevel; label: string; emoji: string }[] = [
  { value: 'very_low', label: 'Very Low', emoji: '😢' },
  { value: 'low', label: 'Low', emoji: '😕' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'great', label: 'Great', emoji: '😊' },
]

const ENERGY_OPTIONS: { value: EnergyLevel; label: string; emoji: string }[] = [
  { value: 'very_low', label: 'Very Low', emoji: '🪫' },
  { value: 'low', label: 'Low', emoji: '🔋' },
  { value: 'moderate', label: 'Moderate', emoji: '⚡' },
  { value: 'high', label: 'High', emoji: '⚡⚡' },
  { value: 'very_high', label: 'Very High', emoji: '🔥' },
]

function estimatePhase(dayOfCycle: number): { phase: string; color: string; desc: string } {
  if (dayOfCycle <= 5) return { phase: 'Menstrual', color: 'text-rose-600', desc: 'Menstruation is occurring. Rest, hydration, and warmth help comfort.' }
  if (dayOfCycle <= 13) return { phase: 'Follicular', color: 'text-violet-600', desc: 'Energy rises as estrogen climbs. Great time for focus and movement.' }
  if (dayOfCycle <= 16) return { phase: 'Ovulatory', color: 'text-amber-600', desc: 'Estimated ovulation window. Energy and mood peak.' }
  return { phase: 'Luteal', color: 'text-blue-600', desc: 'Progesterone rises. Prioritize restful sleep and balanced hydration.' }
}

function LogPeriodModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (newCycle: any) => void
}) {
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [flow, setFlow] = useState<FlowLevel>('moderate')
  const [mood, setMood] = useState<MoodLevel>('neutral')
  const [energy, setEnergy] = useState<EnergyLevel>('moderate')
  const [cramps, setCramps] = useState<'none' | 'mild' | 'moderate' | 'severe'>('mild')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!periodStart) return
    setLoading(true)

    try {
      const res = await fetch('/api/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodStart,
          periodEnd: periodEnd || undefined,
          flow,
          cramps: cramps === 'none' ? 'mild' : cramps,
          mood,
          energy,
          notes: notes || undefined,
        }),
      })

      const newCycle = {
        id: 'cycle_' + Date.now(),
        period_start: periodStart,
        period_end: periodEnd || null,
        flow,
        cramps,
        mood,
        energy,
        notes,
      }

      onSave(newCycle)
      onClose()
    } catch (err) {
      console.warn('[Log Cycle Error]:', err)
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
          <h3 className="font-display text-xl font-bold text-gray-900">Log Period Entry</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="period-start">Period start date <span className="text-rose-500">*</span></label>
            <input id="period-start" type="date" className="input" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} required />
          </div>

          <div>
            <label className="label" htmlFor="period-end">Period end date (optional)</label>
            <input id="period-end" type="date" className="input" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
          </div>

          <div>
            <label className="label">Flow level</label>
            <div className="grid grid-cols-2 gap-2">
              {FLOW_OPTIONS.map((f) => (
                <button key={f.value} type="button" onClick={() => setFlow(f.value)}
                  className={cn('py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left flex items-center gap-2',
                    flow === f.value ? 'bg-rose-100 border-rose-400 text-rose-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  )}>
                  <span>{f.emoji}</span>{f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Cramps</label>
            <div className="flex gap-2">
              {['none', 'mild', 'moderate', 'severe'].map((c) => (
                <button key={c} type="button" onClick={() => setCramps(c as typeof cramps)}
                  className={cn('flex-1 py-2 rounded-xl text-xs font-medium border transition-all capitalize',
                    cramps === c ? 'bg-rose-100 border-rose-400 text-rose-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  )}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Mood</label>
            <div className="flex gap-2 flex-wrap">
              {MOOD_OPTIONS.map((m) => (
                <button key={m.value} type="button" onClick={() => setMood(m.value)}
                  className={cn('flex flex-col items-center p-2.5 rounded-xl border transition-all min-w-[52px]',
                    mood === m.value ? 'bg-woman-100 border-woman-400' : 'bg-white border-gray-200 hover:border-gray-300'
                  )}>
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-[10px] text-gray-600 mt-1 font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Energy</label>
            <div className="flex gap-2 flex-wrap">
              {ENERGY_OPTIONS.map((e) => (
                <button key={e.value} type="button" onClick={() => setEnergy(e.value)}
                  className={cn('flex flex-col items-center p-2.5 rounded-xl border transition-all min-w-[52px]',
                    energy === e.value ? 'bg-woman-100 border-woman-400' : 'bg-white border-gray-200 hover:border-gray-300'
                  )}>
                  <span className="text-lg">{e.emoji}</span>
                  <span className="text-[10px] text-gray-600 mt-1 font-medium">{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="cycle-notes">Notes (optional)</label>
            <textarea id="cycle-notes" className="input resize-none h-20" placeholder="Any observations..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex gap-3">
            <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary-woman flex-1" onClick={handleSave} disabled={!periodStart || loading} id="save-period-btn">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CyclePage() {
  const [showForm, setShowForm] = useState(false)
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [cycles, setCycles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadCycles() {
      try {
        const res = await fetch('/api/cycle', { cache: 'no-store' }).catch(() => null)
        if (res && res.ok && isMounted) {
          const data = await res.json()
          if (data.cycles) setCycles(data.cycles)
        }
      } catch (err) {
        console.warn('[Fetch Cycles Error]:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadCycles()
    return () => {
      isMounted = false
    }
  }, [])

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Calculate phase from latest logged cycle if available
  const latestCycle = cycles[0]
  let cycleDayEstimate = 1
  if (latestCycle?.period_start) {
    const diffMs = Date.now() - new Date(latestCycle.period_start).getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    cycleDayEstimate = Math.max(1, (diffDays % 28) + 1)
  }

  const { phase, color, desc } = estimatePhase(cycleDayEstimate)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // Set of logged day numbers for current month
  const periodDaysThisMonth = new Set<number>()
  cycles.forEach((c) => {
    if (c.period_start) {
      const d = new Date(c.period_start)
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        for (let i = 0; i < 5; i++) {
          if (d.getDate() + i <= daysInMonth) {
            periodDaysThisMonth.add(d.getDate() + i)
          }
        }
      }
    }
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Cycle Tracking</h2>
          <p className="section-subtitle">Monitor your menstrual cycle and health patterns</p>
        </div>
        <button className="btn btn-primary-woman" onClick={() => setShowForm(true)} id="log-period-btn">
          <Plus className="w-4 h-4" />
          Log Period
        </button>
      </div>

      {/* Phase card */}
      <div className={cn('card p-6 border-l-4 shadow-soft', color.replace('text-', 'border-'))}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-woman-100 to-rose-100 flex items-center justify-center flex-shrink-0">
            <Moon className="w-6 h-6 text-woman-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              {cycles.length > 0 ? `Estimated Phase · Day ${cycleDayEstimate}` : 'Cycle Phase Overview'}
            </div>
            <h3 className={cn('font-display text-2xl font-bold mb-1', color)}>{phase} Phase</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            <p className="text-xs text-gray-400 italic mt-2">Phase is estimated based on your logged cycle logs. Not a medical diagnosis.</p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-bold text-gray-900">
            {MONTHS[viewMonth]} {viewYear}
          </h3>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isPeriod = periodDaysThisMonth.has(day)
            const isToday = day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear()

            return (
              <div
                key={day}
                className={cn(
                  'h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all relative',
                  isPeriod
                    ? 'bg-rose-500 text-white shadow-xs font-bold'
                    : isToday
                    ? 'border-2 border-woman-500 text-woman-600 font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {day}
                {isPeriod && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span>Period days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-woman-500 inline-block" />
            <span>Today</span>
          </div>
        </div>
      </div>

      {showForm && (
        <LogPeriodModal
          onClose={() => setShowForm(false)}
          onSave={(newCycle) => setCycles((prev) => [newCycle, ...prev])}
        />
      )}
    </div>
  )
}
