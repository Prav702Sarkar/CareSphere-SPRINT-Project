'use client'

import { useState } from 'react'
import { Apple, Clock, Check, Bell, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MealType } from '@/types'

const MEALS: { type: MealType; label: string; emoji: string; defaultTime: string; desc: string }[] = [
  { type: 'breakfast', label: 'Breakfast', emoji: '🌅', defaultTime: '08:00', desc: 'Kickstart metabolic energy & hormone synthesis' },
  { type: 'morning_snack', label: 'Morning Snack', emoji: '🍎', defaultTime: '10:30', desc: 'Steady blood sugar & focus boost' },
  { type: 'lunch', label: 'Lunch', emoji: '🥗', defaultTime: '13:00', desc: 'Balanced macronutrients & digestive ease' },
  { type: 'evening_snack', label: 'Evening Snack', emoji: '🍌', defaultTime: '16:30', desc: 'Sustained luteal & cortisol support' },
  { type: 'dinner', label: 'Dinner', emoji: '🍽️', defaultTime: '19:30', desc: 'Light, nutrient-dense evening recovery' },
]

export default function FoodReminderPage() {
  const [reminders, setReminders] = useState(
    MEALS.reduce((acc, m) => ({ ...acc, [m.type]: { time: m.defaultTime, enabled: m.type !== 'morning_snack' } }), {} as Record<MealType, { time: string; enabled: boolean }>)
  )
  const [saved, setSaved] = useState(false)

  const toggle = (type: MealType) =>
    setReminders((p) => ({ ...p, [type]: { ...p[type], enabled: !p[type].enabled } }))

  const setTime = (type: MealType, time: string) =>
    setReminders((p) => ({ ...p, [type]: { ...p[type], time } }))

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const activeCount = Object.values(reminders).filter((r) => r.enabled).length

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">Food Reminders</h2>
        <p className="section-subtitle">Schedule gentle reminders for all your daily meals and snacks</p>
      </div>

      {/* Summary Banner */}
      <div className="card p-6 flex items-center justify-between bg-gradient-to-br from-woman-50/80 via-rose-50/60 to-peach-50/40 border-woman-100 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-display text-2xl font-black text-gray-900 flex items-center gap-2">
              {activeCount} of {MEALS.length} Active
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Meal schedules personalized to your metabolic cycle</div>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/80 border border-woman-200 text-woman-700 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-woman-500" /> Auto-sync
        </span>
      </div>

      {/* Meal Reminders List */}
      <div className="space-y-3.5">
        {MEALS.map((meal) => {
          const r = reminders[meal.type]
          return (
            <div
              key={meal.type}
              className={cn(
                'card p-5 transition-all duration-200 border border-gray-100 hover:border-woman-200 hover:shadow-soft',
                !r.enabled && 'opacity-60 bg-gray-50/60'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Emoji + Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 shadow-2xs flex items-center justify-center text-xl flex-shrink-0">
                    {meal.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{meal.label}</span>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        r.enabled ? 'bg-woman-100 text-woman-700' : 'bg-gray-200 text-gray-500'
                      )}>
                        {r.enabled ? 'Active' : 'Off'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{meal.desc}</p>
                  </div>
                </div>

                {/* Time Picker Chip + Toggle Switch */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Time Chip */}
                  <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all',
                    r.enabled
                      ? 'bg-white border-gray-200 hover:border-woman-300 shadow-2xs'
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  )}>
                    <Clock className={cn('w-3.5 h-3.5', r.enabled ? 'text-woman-500' : 'text-gray-400')} />
                    <input
                      type="time"
                      value={r.time}
                      onChange={(e) => setTime(meal.type, e.target.value)}
                      disabled={!r.enabled}
                      className="text-xs font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
                      aria-label={`${meal.label} reminder time`}
                    />
                  </div>

                  {/* Clean Accessible Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={r.enabled}
                    aria-label={`Toggle ${meal.label} reminder`}
                    onClick={() => toggle(meal.type)}
                    className={cn(
                      'relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-woman-400 focus:ring-offset-2',
                      r.enabled ? 'bg-gradient-to-r from-woman-600 to-rose-500 shadow-sm' : 'bg-gray-300'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                        r.enabled ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Save Button */}
      <button
        type="button"
        className="btn btn-primary-woman w-full btn-lg shadow-md"
        onClick={handleSave}
        id="save-food-reminders-btn"
      >
        {saved ? (
          <>
            <Check className="w-5 h-5" /> Saved Successfully!
          </>
        ) : (
          <>
            <Apple className="w-5 h-5" /> Save Food Reminder Schedule
          </>
        )}
      </button>

      <div className="text-xs text-gray-400 text-center">
        Food reminders will notify you on your device. You can adjust your reminder times anytime.
      </div>
    </div>
  )
}
