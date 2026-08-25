'use client'

import { useState } from 'react'
import {
  BarChart2, TrendingUp, Zap, AlertCircle, Activity, Droplets, Moon,
  FileText, Download, Printer, Shield, CheckCircle2, X, Sparkles, Calendar
} from 'lucide-react'

const weeklyInsights = [
  {
    type: 'cycle',
    icon: Moon,
    color: 'text-woman-600',
    bg: 'bg-woman-50',
    border: 'border-woman-100',
    title: 'Cycle Consistency',
    value: '28 days',
    trend: 'stable',
    body: 'Your last two cycles were 27 and 28 days. This is within a typical range. Slight month-to-month variation is normal and expected.'
  },
  {
    type: 'hydration',
    icon: Droplets,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Hydration Average',
    value: '1.7L/day',
    trend: 'improving',
    body: 'Your average daily water intake has increased by 15% compared to last week. You reached your 2L goal on 4 of 7 days.'
  },
  {
    type: 'symptom',
    icon: Activity,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    title: 'Most Frequent Symptom',
    value: 'Fatigue',
    trend: 'watch',
    body: 'Fatigue was your most frequently logged symptom this week (4 logs). Fatigue can be associated with multiple factors including sleep, cycle phase, nutrition, and stress.'
  },
]

const monthlyTrend = [
  { week: 'W1', water: 75, symptoms: 2, sleep: 6.8 },
  { week: 'W2', water: 80, symptoms: 4, sleep: 7.2 },
  { week: 'W3', water: 65, symptoms: 3, sleep: 6.5 },
  { week: 'W4', water: 85, symptoms: 1, sleep: 7.8 },
]

export default function InsightsPage() {
  const [showSummaryModal, setShowSummaryModal] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Health Insights & Trends</h2>
          <p className="section-subtitle">Your personalized health patterns, weekly progress, and exportable records</p>
        </div>
        <button
          onClick={() => setShowSummaryModal(true)}
          className="btn btn-primary-woman btn-sm flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Doctor's Health Summary
        </button>
      </div>

      <div className="health-disclaimer">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>
          Insights are computed from your logged self-reports. Patterns shown here are for self-awareness and healthcare discussion only — not medical diagnoses.
        </span>
      </div>

      {/* Weekly insights */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">This Week&apos;s Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {weeklyInsights.map((insight) => (
            <div key={insight.title} className={`card p-5 border ${insight.border}`}>
              <div className={`w-9 h-9 rounded-xl ${insight.bg} flex items-center justify-center mb-3`}>
                <insight.icon className={`w-4 h-4 ${insight.color}`} />
              </div>
              <div className={`text-xl font-display font-bold ${insight.color} mb-1`}>{insight.value}</div>
              <div className="text-xs font-semibold text-gray-700 mb-2">{insight.title}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{insight.body}</p>
              <div className={`mt-2 badge text-[10px] ${insight.trend === 'improving' ? 'badge-success' : insight.trend === 'watch' ? 'badge-warning' : 'bg-gray-100 text-gray-600'}`}>
                {insight.trend === 'improving' ? '↑ Improving' : insight.trend === 'watch' ? '👀 Watch' : '→ Stable'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly bars */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 className="w-5 h-5 text-woman-500" />
          <h3 className="font-semibold text-gray-800">Monthly Overview Trends</h3>
        </div>
        <div className="space-y-5">
          {['water', 'sleep'].map((metric) => (
            <div key={metric}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600 capitalize">
                  {metric === 'water' ? '💧 Hydration %' : '😴 Sleep (hours)'}
                </span>
              </div>
              <div className="flex gap-3 h-20 items-end">
                {monthlyTrend.map((week) => {
                  const val = metric === 'water' ? week.water : week.sleep * 10
                  const label = metric === 'water' ? `${week.water}%` : `${week.sleep}h`
                  return (
                    <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                      <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: '56px' }}>
                        <div
                          className={metric === 'water' ? 'w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-lg' : 'w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-lg'}
                          style={{ height: `${Math.min(val, 100)}%`, marginTop: `${100 - Math.min(val, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500">{week.week}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6 bg-gradient-to-br from-woman-50 to-rose-50 border-woman-100">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-woman-500" />
          <h3 className="font-semibold text-woman-800">Personalized Focus Areas</h3>
        </div>
        <div className="space-y-2.5">
          {[
            'Try to reach your 2L water goal on more days this week — you\'re close!',
            'Your sleep average of 7.1 hours is good. Maintaining consistency supports hormonal health.',
            'Fatigue logging increased mid-week. Consider if this correlates with sleep or cycle phase patterns.',
          ].map((rec, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-woman-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-woman-700">{i + 1}</div>
              <span className="text-sm text-woman-800 leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Summary Export Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSummaryModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-modal animate-scale-in max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-woman-100 flex items-center justify-center text-woman-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900">Health Summary Report</h3>
                  <p className="text-xs text-gray-400">Exportable overview for your doctor or healthcare provider</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="btn btn-secondary btn-sm flex items-center gap-1 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-6 text-left">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-gray-900">CareSphere Health Summary</h2>
                  <p className="text-xs text-gray-500">Self-Reported Health Awareness & Wellness Trends</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div>Report Version: 1.0</div>
                </div>
              </div>

              {/* Cycle & Reproductive Health */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-woman-600" /> Cycle & Menstrual Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Avg Cycle Length</span>
                    <span className="font-bold text-gray-800">28 Days</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Period Duration</span>
                    <span className="font-bold text-gray-800">5 Days</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Cycle Regularity</span>
                    <span className="font-bold text-emerald-600">Regular (±1d)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Current Phase</span>
                    <span className="font-bold text-woman-700">Follicular (Day 8)</span>
                  </div>
                </div>
              </div>

              {/* Recent Symptoms */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-600" /> Symptom Frequency (Last 30 Days)
                </h4>
                <div className="space-y-1.5 text-xs">
                  {[
                    { symptom: 'Fatigue', count: 4, severity: 'Moderate', notes: 'Correlated with mid-cycle luteal transition' },
                    { symptom: 'Mild Lower Pelvic Pressure', count: 2, severity: 'Mild', notes: 'Logged post-workout, resolved with hydration' },
                    { symptom: 'Menstrual Cramps', count: 2, severity: 'Mild to Moderate', notes: 'Days 1-2 of cycle' },
                  ].map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-semibold text-gray-800">{s.symptom}</span>
                        <span className="text-gray-500 block text-[11px]">{s.notes}</span>
                      </div>
                      <div className="text-right">
                        <span className="badge bg-gray-200 text-gray-700 text-[10px]">{s.count} logs</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{s.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hydration & Nutrition */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" /> Lifestyle & Hydration Patterns
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Avg Hydration</span>
                    <span className="font-bold text-gray-800">1,750 ml / day</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Avg Sleep Duration</span>
                    <span className="font-bold text-gray-800">7.1 Hours / night</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Reported Stress</span>
                    <span className="font-bold text-amber-600">Moderate (5/10)</span>
                  </div>
                </div>
              </div>

              {/* Clinical Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-700" /> Clinician Information Notice
                </div>
                <p>
                  This summary is compiled solely from self-reported logs on the CareSphere platform for informational context. It does not provide medical diagnoses, treatment instructions, or laboratory evaluations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
