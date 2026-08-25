'use client'

import Link from 'next/link'
import {
  Activity, Shield, BookOpen, Heart, Droplets, Apple, Moon,
  Brain, Users, BarChart2, ArrowRight, Plus, Zap, Bell,
  TrendingUp, CheckCircle2, AlertCircle, Pill
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// QUICK STAT CARD
// ============================================================

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
  gradient: string
  href: string
}) {
  return (
    <Link href={href} className="card-hover p-5 block group">
      <div className={cn(
        'w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110',
        gradient
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className={cn('text-2xl font-display font-black bg-gradient-to-br bg-clip-text text-transparent', gradient)}>
        {value}
      </div>
      <div className="text-xs font-semibold text-gray-700 mt-0.5">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
    </Link>
  )
}

// ============================================================
// QUICK LOG BUTTON
// ============================================================

function QuickAction({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  color: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm',
        color
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </Link>
  )
}

// ============================================================
// INSIGHT CARD
// ============================================================

function InsightCard({
  type,
  title,
  body,
}: {
  type: 'tip' | 'warning' | 'success'
  title: string
  body: string
}) {
  const styles = {
    tip: { bg: 'bg-blue-50 border-blue-200', icon: Zap, iconColor: 'text-blue-500', titleColor: 'text-blue-800' },
    warning: { bg: 'bg-amber-50 border-amber-200', icon: AlertCircle, iconColor: 'text-amber-500', titleColor: 'text-amber-800' },
    success: { bg: 'bg-green-50 border-green-200', icon: CheckCircle2, iconColor: 'text-green-500', titleColor: 'text-green-800' },
  }[type]

  return (
    <div className={cn('flex gap-3 p-4 rounded-2xl border', styles.bg)}>
      <styles.icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', styles.iconColor)} />
      <div>
        <div className={cn('text-xs font-semibold mb-0.5', styles.titleColor)}>{title}</div>
        <div className="text-xs text-gray-600 leading-relaxed">{body}</div>
      </div>
    </div>
  )
}

// ============================================================
// FOUR PILLAR LINKS
// ============================================================

const pillarLinks = [
  {
    href: '/woman/symptoms',
    icon: Activity,
    label: 'Symptoms',
    desc: 'Log & track symptoms',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 border-rose-100 hover:border-rose-200',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    href: '/woman/prevention',
    icon: Shield,
    label: 'Prevention',
    desc: 'Build healthy habits',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 border-violet-100 hover:border-violet-200',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    href: '/woman/education',
    icon: BookOpen,
    label: 'Education',
    desc: 'Learn & understand',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 border-amber-100 hover:border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    href: '/woman/remedies',
    icon: Pill,
    label: 'Remedies',
    desc: 'General self-care',
    gradient: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50 border-teal-100 hover:border-teal-200',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
]

// ============================================================
// MAIN DASHBOARD PAGE
// ============================================================

export default function WomanDashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* ===== GREETING ===== */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-medium">{today}</p>
          <h2 className="font-display text-3xl font-black text-gray-900 mt-1">
            Good day! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">Here's your health overview for today.</p>
        </div>
        <Link
          href="/woman/symptoms"
          className="btn btn-primary-woman self-start sm:self-auto"
          id="quick-log-symptoms"
        >
          <Plus className="w-4 h-4" />
          Log Symptoms
        </Link>
      </div>

      {/* ===== CYCLE PHASE BANNER ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-woman-600 via-rose-500 to-peach-500 p-6 text-white shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-white/80" />
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">Estimated Cycle Phase</span>
            </div>
            <div className="font-display text-3xl font-black">Follicular Phase</div>
            <div className="text-white/70 text-sm mt-1">
              Day 8 of your cycle · Ovulation estimated in ~6 days
            </div>
            <p className="text-xs text-white/60 mt-2 italic">
              This is an estimate based on your logged data. Actual phase may vary.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/woman/cycle"
              className="btn bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm"
            >
              <Moon className="w-4 h-4" />
              View Cycle
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <section aria-label="Today's health stats">
        <h3 className="section-title mb-4">Today at a glance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={Droplets}
            label="Water"
            value="1.2L"
            sub="of 2.0L goal"
            gradient="from-blue-500 to-cyan-500"
            href="/woman/water-reminder"
          />
          <StatCard
            icon={Activity}
            label="Symptoms"
            value="2"
            sub="Logged today"
            gradient="from-rose-500 to-pink-500"
            href="/woman/symptoms"
          />
          <StatCard
            icon={Apple}
            label="Meals"
            value="2/3"
            sub="Main meals logged"
            gradient="from-green-500 to-emerald-500"
            href="/woman/nutrition"
          />
          <StatCard
            icon={BarChart2}
            label="Insights"
            value="3"
            sub="New this week"
            gradient="from-woman-500 to-violet-500"
            href="/woman/insights"
          />
        </div>
      </section>

      {/* ===== FOUR PILLARS ===== */}
      <section aria-label="Core health pillars">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Health Pillars</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {pillarLinks.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className={cn(
                'card-hover p-5 border flex flex-col gap-3 group',
                pillar.bg
              )}
            >
              <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200', pillar.iconBg)}>
                <pillar.icon className={cn('w-5 h-5', pillar.iconColor)} />
              </div>
              <div>
                <div className="font-display font-bold text-gray-900">{pillar.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{pillar.desc}</div>
              </div>
              <ArrowRight className={cn('w-4 h-4 mt-auto self-start', pillar.iconColor, 'group-hover:translate-x-1 transition-transform duration-200')} />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== QUICK ACTIONS ===== */}
      <section aria-label="Quick log actions">
        <h3 className="section-title mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <QuickAction icon={Plus} label="Log Water" href="/woman/water-reminder" color="bg-blue-50 border-blue-100 text-blue-600 hover:border-blue-300" />
          <QuickAction icon={Activity} label="Log Symptom" href="/woman/symptoms" color="bg-rose-50 border-rose-100 text-rose-600 hover:border-rose-300" />
          <QuickAction icon={Moon} label="Log Period" href="/woman/cycle" color="bg-woman-50 border-woman-100 text-woman-600 hover:border-woman-300" />
          <QuickAction icon={Apple} label="Log Meal" href="/woman/nutrition" color="bg-green-50 border-green-100 text-green-600 hover:border-green-300" />
          <QuickAction icon={Brain} label="Ask AI" href="/woman/ai-assistant" color="bg-violet-50 border-violet-100 text-violet-600 hover:border-violet-300" />
          <QuickAction icon={BarChart2} label="Insights" href="/woman/insights" color="bg-amber-50 border-amber-100 text-amber-600 hover:border-amber-300" />
        </div>
      </section>

      {/* ===== INSIGHTS + LOVED ONES ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Recent Insights</h3>
            <Link href="/woman/insights" className="text-sm text-woman-600 font-medium hover:text-woman-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <InsightCard
            type="tip"
            title="Hydration goal"
            body="You're at 60% of your daily water goal. The follicular phase is a great time to increase hydration — it supports energy and hormonal balance."
          />
          <InsightCard
            type="success"
            title="Consistent logging streak"
            body="You've logged symptoms for 5 consecutive days. Consistent tracking helps identify patterns in your health data."
          />
          <InsightCard
            type="warning"
            title="Cycle irregularity noticed"
            body="Your last two cycles varied by more than 7 days. Consider monitoring symptoms and speaking with a healthcare professional if this continues."
          />
        </div>

        {/* Loved Ones + Reminders */}
        <div className="space-y-4">
          <h3 className="section-title">Quick Links</h3>

          <Link href="/woman/loved-ones" className="card-hover p-5 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900">Loved Ones</div>
              <div className="text-xs text-gray-400 mt-0.5">Manage partner access</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/woman/food-reminder" className="card-hover p-5 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900">Meal Reminders</div>
              <div className="text-xs text-gray-400 mt-0.5">3 reminders active</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/woman/ai-assistant" className="card-hover p-5 flex items-center gap-3 group bg-gradient-to-br from-woman-50 to-rose-50 border border-woman-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-woman-100 to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-woman-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-woman-800">AI Assistant</div>
              <div className="text-xs text-woman-500 mt-0.5">Ask anything health-related</div>
            </div>
            <ArrowRight className="w-4 h-4 text-woman-300 group-hover:text-woman-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <div className="health-disclaimer">
            <Shield className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
            <span className="text-[11px]">CareSphere is for health education only. Always consult a qualified healthcare professional for medical advice.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
