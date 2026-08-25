'use client'

import { useState, useEffect, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Heart, Shield, ArrowRight, ArrowLeft, Check, User, Calendar,
  Activity, Apple, Droplets, Brain, Sparkles, Flame, RefreshCw
} from 'lucide-react'
import type { OnboardingData, UserRole, AgeGroup, LifestyleType, DietaryType } from '@/types'
import { cn } from '@/lib/utils'

// ============================================================
// STEP CONFIGS
// ============================================================

const TOTAL_STEPS = 6

const stepTitlesWoman = [
  'Choose Your Experience',
  'Your Profile',
  'Menstrual Cycle Parameters',
  'Health History & Awareness',
  'Lifestyle & Daily Routine',
  'Nutrition Preferences',
]

const stepTitlesMan = [
  'Choose Your Experience',
  'Your Profile',
  'Hydration & UTI Awareness',
  'Health Sensitivity & Focus',
  'Activity Level & Routine',
  'Nutrition & Recovery',
]

const stepIconsWoman = [Heart, User, Calendar, Brain, Activity, Apple]
const stepIconsMan = [Shield, User, Droplets, Brain, Activity, Apple]

// ============================================================
// INITIAL DATA
// ============================================================

const initialData: OnboardingData = {
  name: '',
  ageGroup: '25_34',
  role: 'woman',
  lifestyle: 'moderately_active',
  conditions: [],
  healthConcerns: [],
  sleepHours: 7.5,
  activityLevel: 'moderately_active',
  stressLevel: 5,
  dietaryType: 'non_vegetarian',
  dietaryRestrictions: [],
  dietaryGoals: [],
}

// ============================================================
// STEP PROGRESS BAR
// ============================================================

function StepProgress({ current, total, role }: { current: number; total: number; role: UserRole }) {
  const isMan = role === 'man'
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500">Step {current} of {total}</span>
        <span className={cn('text-xs font-bold', isMan ? 'text-man-600' : 'text-woman-600')}>
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            isMan
              ? 'bg-gradient-to-r from-man-500 to-teal-500'
              : 'bg-gradient-to-r from-woman-500 to-rose-500'
          )}
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ============================================================
// OPTION CARD
// ============================================================

function OptionCard({
  selected,
  onClick,
  icon: Icon,
  label,
  desc,
  role,
}: {
  selected: boolean
  onClick: () => void
  icon?: React.ComponentType<{ className?: string }>
  label: string
  desc?: string
  role: UserRole
}) {
  const isMan = role === 'man'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-200',
        selected
          ? isMan
            ? 'border-man-500 bg-man-50/80 shadow-2xs'
            : 'border-woman-500 bg-woman-50/80 shadow-2xs'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
      )}
    >
      {Icon && (
        <div className={cn(
          'w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs',
          selected
            ? isMan ? 'bg-man-500 text-white' : 'bg-woman-500 text-white'
            : 'bg-gray-100 text-gray-500'
        )}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-gray-900">{label}</div>
        {desc && <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>}
      </div>
      {selected && (
        <div className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
          isMan ? 'bg-man-500' : 'bg-woman-500'
        )}>
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        </div>
      )}
    </button>
  )
}

// ============================================================
// MULTI-SELECT TAG
// ============================================================

function MultiSelectTag({
  label,
  selected,
  onToggle,
  role,
}: {
  label: string
  selected: boolean
  onToggle: () => void
  role: UserRole
}) {
  const isMan = role === 'man'
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150',
        selected
          ? isMan
            ? 'bg-man-100 border-man-400 text-man-800 shadow-2xs'
            : 'bg-woman-100 border-woman-400 text-woman-800 shadow-2xs'
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      )}
    >
      {selected && '✓ '}{label}
    </button>
  )
}

// ============================================================
// STEP 1 — ROLE SELECTION (FIRST STEP)
// ============================================================

function Step1Role({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-black text-gray-900 mb-1">
          Choose Your CareSphere Experience
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Select the health dashboard tailored for your personal wellness goals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        <OptionCard
          selected={data.role === 'woman'}
          onClick={() => onChange({ role: 'woman' })}
          icon={Heart}
          label="I'm a Woman"
          desc="Complete wellness companion — hormonal cycles, PCOS/PCOD education, UTI prevention, remedies & AI companion"
          role="woman"
        />
        <OptionCard
          selected={data.role === 'man'}
          onClick={() => onChange({ role: 'man' })}
          icon={Shield}
          label="I'm a Boy / Man"
          desc="Male urological health — UTI education, symptom checks, proactive prevention, hydration logs & partner sharing"
          role="man"
        />
      </div>

      <div className="health-disclaimer text-xs">
        <Shield className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>You can switch between modes or manage loved ones access anytime in settings.</span>
      </div>
    </div>
  )
}

// ============================================================
// STEP 2 — BASIC PROFILE
// ============================================================

function Step2Profile({
  data,
  onChange,
  role,
}: {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  role: UserRole
}) {
  const ageGroups: { value: AgeGroup; label: string }[] = [
    { value: 'under_18', label: 'Under 18' },
    { value: '18_24', label: '18 – 24' },
    { value: '25_34', label: '25 – 34' },
    { value: '35_44', label: '35 – 44' },
    { value: '45_54', label: '45 – 54' },
    { value: '55_plus', label: '55+' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Tell us about yourself</h2>
        <p className="text-xs sm:text-sm text-gray-500">This helps personalize your wellness dashboards and recommendations.</p>
      </div>

      {/* Name */}
      <div>
        <label className="label text-xs font-bold text-gray-700" htmlFor="onboarding-name">Preferred Name</label>
        <input
          id="onboarding-name"
          className="input text-sm"
          placeholder="What should we call you?"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      {/* Age group */}
      <div>
        <label className="label text-xs font-bold text-gray-700">Age Group</label>
        <div className="grid grid-cols-3 gap-2">
          {ageGroups.map((ag) => (
            <button
              key={ag.value}
              type="button"
              onClick={() => onChange({ ageGroup: ag.value })}
              className={cn(
                'py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-150',
                data.ageGroup === ag.value
                  ? role === 'man'
                    ? 'bg-man-100 border-man-400 text-man-800 shadow-2xs ring-1 ring-man-300'
                    : 'bg-woman-100 border-woman-400 text-woman-800 shadow-2xs ring-1 ring-woman-300'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {ag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP 3 — TAILORED HEALTH BASELINE
// ============================================================

function Step3Health({
  data,
  onChange,
  role,
}: {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  role: UserRole
}) {
  const isMan = role === 'man'

  if (isMan) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Hydration & UTI Awareness</h2>
          <p className="text-xs sm:text-sm text-gray-500">Set your daily hydration goal to support optimal urinary flushing.</p>
        </div>

        <div>
          <label className="label text-xs font-bold text-gray-700" htmlFor="daily-water">
            Daily Water Target (ml)
          </label>
          <div className="relative">
            <input
              id="daily-water"
              type="number"
              min={1000}
              max={4500}
              step={100}
              className="input pr-12 text-sm"
              placeholder="2000"
              value={data.dailyWaterTarget || 2000}
              onChange={(e) => onChange({ dailyWaterTarget: parseInt(e.target.value) || 2000 })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">ml</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Recommended: 2,000ml – 2,500ml for active lifestyles.</p>
        </div>

        <div>
          <label className="label text-xs font-bold text-gray-700">Primary Goal</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'UTI Prevention Habits',
              'Hydration Tracking',
              'Partner Support',
              'General Wellness',
            ].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ primaryGoal: g })}
                className={cn(
                  'p-3 rounded-2xl text-xs font-semibold border transition-all text-left',
                  (data.primaryGoal || 'UTI Prevention Habits') === g
                    ? 'bg-man-100 border-man-400 text-man-900 shadow-2xs ring-1 ring-man-300'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Woman Experience
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Menstrual Cycle Baseline</h2>
        <p className="text-xs sm:text-sm text-gray-500">Optional — helps calculate estimated follicular, ovulation, and luteal phases.</p>
      </div>

      <div>
        <label className="label text-xs font-bold text-gray-700" htmlFor="last-period">Last Period Start Date</label>
        <input
          id="last-period"
          type="date"
          className="input text-xs"
          value={data.lastPeriodDate ?? ''}
          onChange={(e) => onChange({ lastPeriodDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-xs font-bold text-gray-700" htmlFor="cycle-length">Cycle Length (Days)</label>
          <input
            id="cycle-length"
            type="number"
            min={21}
            max={45}
            className="input text-xs"
            placeholder="28"
            value={data.cycleLength ?? 28}
            onChange={(e) => onChange({ cycleLength: parseInt(e.target.value) || undefined })}
          />
          <span className="text-[10px] text-gray-400">Standard: 28 days</span>
        </div>
        <div>
          <label className="label text-xs font-bold text-gray-700" htmlFor="period-duration">Period Duration (Days)</label>
          <input
            id="period-duration"
            type="number"
            min={2}
            max={10}
            className="input text-xs"
            placeholder="5"
            value={data.periodDuration ?? 5}
            onChange={(e) => onChange({ periodDuration: parseInt(e.target.value) || undefined })}
          />
          <span className="text-[10px] text-gray-400">Typical: 4–7 days</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP 4 — HEALTH AWARENESS
// ============================================================

function Step4Awareness({
  data,
  onChange,
  role,
}: {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  role: UserRole
}) {
  const isMan = role === 'man'

  const womanConditions = [
    'PCOS / PCOD', 'Endometriosis', 'Thyroid disorder', 'Recurrent UTI',
    'Heavy Cramps', 'Insulin Sensitivity', 'None / General Wellness',
  ]

  const womanConcerns = [
    'Irregular cycles', 'Painful periods', 'UTI recurrence', 'Hormonal acne',
    'Metabolic health', 'Energy & fatigue', 'Fertility awareness', 'General wellness',
  ]

  const manConditions = [
    'Recurrent UTI', 'Urethral Sensitivity', 'Kidney Stones history',
    'Dehydration Prone', 'Sports / Friction Irritation', 'None / General Wellness',
  ]

  const manConcerns = [
    'Burning during urination', 'Frequent voiding', 'Post-exercise hydration',
    'Hygiene & prevention', 'Kidney & bladder wellness', 'General wellness',
  ]

  const conditions = isMan ? manConditions : womanConditions
  const concerns = isMan ? manConcerns : womanConcerns

  const toggle = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
          {isMan ? 'Health Sensitivity & History' : 'Health Focus & History'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Select areas relevant to your routine (all optional).
        </p>
      </div>

      <div>
        <label className="label text-xs font-bold text-gray-700">Health History / Sensitivity</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {conditions.map((c) => (
            <MultiSelectTag
              key={c}
              label={c}
              selected={(data.conditions ?? []).includes(c)}
              onToggle={() => onChange({ conditions: toggle(data.conditions ?? [], c) })}
              role={role}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="label text-xs font-bold text-gray-700">Current Health & Prevention Goals</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {concerns.map((c) => (
            <MultiSelectTag
              key={c}
              label={c}
              selected={(data.healthConcerns ?? []).includes(c)}
              onToggle={() => onChange({ healthConcerns: toggle(data.healthConcerns ?? [], c) })}
              role={role}
            />
          ))}
        </div>
      </div>

      <div className="health-disclaimer text-xs">
        <Shield className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>This information is strictly private and used to tailor educational tips.</span>
      </div>
    </div>
  )
}

// ============================================================
// STEP 5 — LIFESTYLE
// ============================================================

function Step5Lifestyle({
  data,
  onChange,
  role,
}: {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  role: UserRole
}) {
  const lifestyles: { value: LifestyleType; label: string; desc: string }[] = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Mostly desk work, light physical activity' },
    { value: 'lightly_active', label: 'Lightly active', desc: 'Light exercise / walks 1–3 days a week' },
    { value: 'moderately_active', label: 'Moderately active', desc: 'Active routine / gym 3–5 days a week' },
    { value: 'very_active', label: 'Very active', desc: 'Intense training / athletics 6+ days a week' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Lifestyle & Daily Routine</h2>
        <p className="text-xs sm:text-sm text-gray-500">Calibrate your activity, sleep, and recovery baselines.</p>
      </div>

      <div>
        <label className="label text-xs font-bold text-gray-700">Activity Level</label>
        <div className="space-y-2 mt-1">
          {lifestyles.map((l) => (
            <OptionCard
              key={l.value}
              selected={data.activityLevel === l.value}
              onClick={() => onChange({ activityLevel: l.value, lifestyle: l.value })}
              label={l.label}
              desc={l.desc}
              role={role}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label text-xs font-bold text-gray-700" htmlFor="sleep-hours">Sleep Target (hrs)</label>
          <div className="relative">
            <input
              id="sleep-hours"
              type="number"
              min={4}
              max={12}
              step={0.5}
              className="input pr-10 text-xs"
              value={data.sleepHours !== undefined && !isNaN(data.sleepHours) ? data.sleepHours : ''}
              onChange={(e) => {
                const v = parseFloat(e.target.value)
                onChange({ sleepHours: isNaN(v) ? undefined : v })
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">hrs</span>
          </div>
        </div>
        <div>
          <label className="label text-xs font-bold text-gray-700" htmlFor="stress-level">Stress Level (1–10)</label>
          <input
            id="stress-level"
            type="number"
            min={1}
            max={10}
            className="input text-xs"
            value={data.stressLevel !== undefined && !isNaN(data.stressLevel) ? data.stressLevel : ''}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              onChange({ stressLevel: isNaN(v) ? undefined : v })
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP 6 — NUTRITION
// ============================================================

function Step6Nutrition({
  data,
  onChange,
  role,
}: {
  data: OnboardingData
  onChange: (updates: Partial<OnboardingData>) => void
  role: UserRole
}) {
  const dietaryTypes: { value: DietaryType; label: string; emoji: string }[] = [
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'non_vegetarian', label: 'Non-Veg', emoji: '🍗' },
    { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
    { value: 'other', label: 'Flexible', emoji: '🍽️' },
  ]

  const restrictions = ['Gluten-free', 'Dairy-free', 'Nut allergy', 'Low-Sugar', 'No restrictions']
  const goals = ['Immune support', 'Urinary flushing', 'Energy boost', 'Gut microbiome', 'Recovery']

  const toggle = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Nutrition & Wellness</h2>
        <p className="text-xs sm:text-sm text-gray-500">Personalizes meal ideas, fluid schedules, and nutrients.</p>
      </div>

      <div>
        <label className="label text-xs font-bold text-gray-700">Dietary Style</label>
        <div className="grid grid-cols-3 gap-2">
          {dietaryTypes.map((dt) => (
            <button
              key={dt.value}
              type="button"
              onClick={() => onChange({ dietaryType: dt.value })}
              className={cn(
                'flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all',
                data.dietaryType === dt.value
                  ? role === 'man'
                    ? 'bg-man-100 border-man-400 text-man-800 shadow-2xs'
                    : 'bg-woman-100 border-woman-400 text-woman-800 shadow-2xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              <span>{dt.emoji}</span>
              <span className="truncate">{dt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label text-xs font-bold text-gray-700">Primary Nutrition Goals</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {goals.map((g) => (
            <MultiSelectTag
              key={g}
              label={g}
              selected={(data.dietaryGoals ?? []).includes(g)}
              onToggle={() => onChange({ dietaryGoals: toggle(data.dietaryGoals ?? [], g) })}
              role={role}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// ONBOARDING CONTENT (WRAPPER)
// ============================================================

function OnboardingContent() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  // Initialize from URL or current user server profile on mount
  useEffect(() => {
    async function initRoleAndProfile() {
      if (!user) return
      try {
        const roleParam = searchParams?.get('role')
        let detectedRole: UserRole = roleParam === 'man' || roleParam === 'boy' ? 'man' : 'woman'

        // Query database profile strictly for CURRENT user
        const res = await fetch('/api/profile', { cache: 'no-store' }).catch(() => null)
        if (res && res.ok) {
          const json = await res.json()
          if (json.profile) {
            if (json.profile.onboardingComplete && json.profile.role) {
              router.replace(json.profile.role === 'man' ? '/man' : '/woman')
              return
            }
            if (json.profile.role) {
              detectedRole = json.profile.role
            }
          }
        }

        setData((prev) => ({
          ...prev,
          role: detectedRole,
          name: user?.firstName || prev.name || '',
        }))
      } finally {
        setInitializing(false)
      }
    }
    initRoleAndProfile()
  }, [searchParams, user, router])

  const update = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const isMan = data.role === 'man'
  const stepTitles = isMan ? stepTitlesMan : stepTitlesWoman
  const stepIcons = isMan ? stepIconsMan : stepIconsWoman
  const StepIcon = stepIcons[step - 1] || Shield

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
    else handleSubmit()
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('caresphere_user_role', data.role)
        localStorage.setItem('caresphere_onboarding_done', 'true')
        document.cookie = `caresphere_auth=true; path=/; max-age=31536000`
        document.cookie = `caresphere_role=${data.role}; path=/; max-age=31536000`
      }

      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((err) => console.warn('[Onboarding Save Warning]:', err))

      // Route immediately to the chosen dashboard
      const targetDashboard = data.role === 'man' ? '/man' : '/woman'
      router.replace(targetDashboard)
    } catch (err) {
      console.warn('[Onboarding Error]:', err)
      const targetDashboard = data.role === 'man' ? '/man' : '/woman'
      router.replace(targetDashboard)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 2) return (data.name || '').trim().length > 0
    return true
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <RefreshCw className="w-8 h-8 text-man-600 animate-spin" />
        <p className="text-xs text-gray-500 font-semibold">Initializing CareSphere Experience...</p>
      </div>
    )
  }

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4 transition-colors duration-500',
      isMan
        ? 'bg-gradient-to-br from-man-50 via-teal-50/50 to-navy-50/30'
        : 'bg-gradient-to-br from-woman-50 via-rose-50/50 to-peach-50/30'
    )}>
      {/* Background Glows */}
      <div className={cn(
        'hero-glow w-96 h-96 fixed -top-20 -left-20 transition-all duration-700',
        isMan ? 'bg-man-400' : 'bg-woman-400'
      )} />
      <div className={cn(
        'hero-glow w-64 h-64 fixed bottom-20 -right-10 transition-all duration-700',
        isMan ? 'bg-teal-400' : 'bg-rose-400'
      )} />

      <div className="relative w-full max-w-lg z-10">
        <div className="bg-white rounded-3xl shadow-modal border border-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              'w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 transition-all',
              isMan ? 'bg-gradient-to-br from-man-500 to-teal-500' : 'bg-gradient-to-br from-woman-500 to-rose-500'
            )}>
              <StepIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                {stepTitles[step - 1]}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <StepProgress current={step} total={TOTAL_STEPS} role={data.role} />
          </div>

          {/* Dynamic Step Content */}
          <div className="onboarding-step min-h-[300px]" key={`${step}-${data.role}`}>
            {step === 1 && <Step1Role data={data} onChange={update} />}
            {step === 2 && <Step2Profile data={data} onChange={update} role={data.role} />}
            {step === 3 && <Step3Health data={data} onChange={update} role={data.role} />}
            {step === 4 && <Step4Awareness data={data} onChange={update} role={data.role} />}
            {step === 5 && <Step5Lifestyle data={data} onChange={update} role={data.role} />}
            {step === 6 && <Step6Nutrition data={data} onChange={update} role={data.role} />}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 alert-error">
              <span>{error}</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="btn btn-secondary text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className={cn(
                'btn btn-lg shadow-md text-xs sm:text-sm',
                isMan ? 'btn-primary-man' : 'btn-primary-woman',
                'min-w-[130px]'
              )}
              id="onboarding-next-btn"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : step === TOTAL_STEPS ? (
                <>
                  <Check className="w-4 h-4" />
                  Finish Setup
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading CareSphere Setup...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
