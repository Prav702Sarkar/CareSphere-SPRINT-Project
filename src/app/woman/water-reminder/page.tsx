'use client'

import { useState } from 'react'
import { Droplets, Plus, Minus, Target, TrendingUp, Bell, X, Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const QUICK_AMOUNTS = [150, 250, 350, 500]
const GOAL_ML = 2000

// Mock data
const todayLogs = [
  { id: '1', amount: 250, time: '8:30 AM' },
  { id: '2', amount: 350, time: '10:15 AM' },
  { id: '3', amount: 250, time: '1:00 PM' },
]

const weekData = [
  { day: 'Mon', ml: 1800, goal: 2000 },
  { day: 'Tue', ml: 2100, goal: 2000 },
  { day: 'Wed', ml: 1500, goal: 2000 },
  { day: 'Thu', ml: 2200, goal: 2000 },
  { day: 'Fri', ml: 1900, goal: 2000 },
  { day: 'Sat', ml: 850, goal: 2000 },
  { day: 'Sun', ml: 850, goal: 2000 },
]

function ProgressRing({ percent, size = 120 }: { percent: number; size?: number }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(percent, 100) / 100) * circ

  return (
    <svg width={size} height={size} className="rotate-[-90deg]" aria-label={`${Math.round(percent)}% of daily water goal`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8e8e8" strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#water-grad)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="progress-ring-circle"
      />
      <defs>
        <linearGradient id="water-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function WaterReminderPage() {
  const [totalMl, setTotalMl] = useState(850)
  const [customAmount, setCustomAmount] = useState('')
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [reminderTime, setReminderTime] = useState('09:00')
  const [reminders, setReminders] = useState([
    { id: '1', time: '09:00', enabled: true },
    { id: '2', time: '12:00', enabled: true },
    { id: '3', time: '15:00', enabled: false },
    { id: '4', time: '19:00', enabled: true },
  ])

  const percent = Math.round((totalMl / GOAL_ML) * 100)
  const remaining = Math.max(GOAL_ML - totalMl, 0)

  const addWater = (ml: number) => setTotalMl((prev) => Math.min(prev + ml, 5000))
  const removeWater = (ml: number) => setTotalMl((prev) => Math.max(prev - ml, 0))

  const addCustom = () => {
    const n = parseInt(customAmount)
    if (n > 0) { addWater(n); setCustomAmount('') }
  }

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

  const addReminder = () => {
    setReminders((prev) => [...prev, { id: Date.now().toString(), time: reminderTime, enabled: true }])
    setShowReminderForm(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="section-title">Water Reminder</h2>
        <p className="section-subtitle">Track your daily hydration and schedule reminders</p>
      </div>

      {/* Progress + Quick add */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Progress ring */}
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="relative">
            <ProgressRing percent={percent} size={140} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-black text-gray-900">
                {percent}%
              </span>
              <span className="text-xs text-gray-400 font-medium">of goal</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-2xl font-bold text-gray-900">
              {(totalMl / 1000).toFixed(1)}L
              <span className="text-base font-normal text-gray-400"> / {GOAL_ML / 1000}L</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {remaining > 0 ? `${remaining}ml remaining` : '🎉 Daily goal reached!'}
            </p>
          </div>
        </div>

        {/* Quick add */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Quick Add</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_AMOUNTS.map((ml) => (
              <button
                key={ml}
                type="button"
                onClick={() => addWater(ml)}
                className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-100 hover:border-blue-200 transition-all hover:-translate-y-0.5"
              >
                <Droplets className="w-4 h-4" />
                {ml}ml
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              className="input flex-1"
              placeholder="Custom amount (ml)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              min={50}
            />
            <button
              type="button"
              onClick={addCustom}
              className="btn bg-blue-500 text-white hover:bg-blue-600 px-4"
              id="add-custom-water-btn"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeWater(250)}
            className="btn btn-ghost w-full text-red-500 hover:bg-red-50 text-xs"
          >
            <Minus className="w-3.5 h-3.5" />
            Remove 250ml (undo)
          </button>
        </div>
      </div>

      {/* Today's log */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Today's Log</h3>
        {todayLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No water logged yet today</div>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-800">{log.amount}ml</span>
                </div>
                <span className="text-xs text-gray-400">{log.time}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Total logged</span>
              <span className="font-display font-bold text-blue-600">{todayLogs.reduce((s, l) => s + l.amount, 0)}ml</span>
            </div>
          </div>
        )}
      </div>

      {/* Weekly trend */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-800 mb-4">This Week</h3>
        <div className="flex items-end gap-2 h-32">
          {weekData.map((d) => {
            const pct = Math.min((d.ml / d.goal) * 100, 100)
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: '80px' }}>
                  <div
                    className={cn(
                      'w-full rounded-lg transition-all duration-700',
                      pct >= 100 ? 'bg-gradient-to-t from-blue-500 to-teal-400' : 'bg-gradient-to-t from-blue-300 to-blue-200'
                    )}
                    style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{d.day}</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Blue = met goal, light = partial hydration</p>
      </div>

      {/* Reminders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Reminders</h3>
          </div>
          <button
            type="button"
            className="btn btn-sm bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
            onClick={() => setShowReminderForm(true)}
            id="add-water-reminder-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {showReminderForm && (
          <div className="mb-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-fade-in">
            <div className="flex gap-3 items-center">
              <input type="time" className="input flex-1" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
              <button type="button" className="btn bg-blue-500 text-white hover:bg-blue-600 btn-sm" onClick={addReminder}>
                <Check className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="btn btn-ghost btn-sm text-gray-500" onClick={() => setShowReminderForm(false)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {reminders.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-800">{r.time}</span>
              </div>
              <button
                type="button"
                onClick={() => toggleReminder(r.id)}
                className={cn(
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
                  r.enabled ? 'bg-gradient-to-r from-blue-500 to-teal-500 shadow-sm' : 'bg-gray-300'
                )}
                role="switch"
                aria-checked={r.enabled}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                    r.enabled ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
