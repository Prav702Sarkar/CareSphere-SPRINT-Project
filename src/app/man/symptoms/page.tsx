'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, AlertCircle, AlertTriangle, BookOpen, ArrowRight, Shield, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const symptoms = [
  'Burning during urination',
  'Frequent urge to urinate',
  'Cloudy urine',
  'Strong-smelling urine',
  'Difficulty starting urination',
  'Lower abdominal pressure',
]

const redFlags = [
  'Fever or chills',
  'Back or flank pain',
  'Blood in urine',
  'Nausea or vomiting',
  'Symptoms worsening over 24–48 hours',
]

export default function ManSymptomsPage() {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (s: string) =>
    setSelected((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
  const hasRed = selected.some((s) => redFlags.includes(s))

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">UTI Symptoms & Awareness</h2>
        <p className="section-subtitle">
          Track male urinary symptoms, identify red flags, and access clinical study guides
        </p>
      </div>

      <div className="health-disclaimer">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>
          This is a symptom awareness tool — <strong>not a diagnostic system</strong>. Proper UTI diagnosis in males requires clinical evaluation and a urine culture test by a licensed doctor.
        </span>
      </div>

      <div className="card p-6">
        <h3 className="font-display text-lg font-bold text-gray-900 mb-2">Symptom Checker</h3>
        <p className="text-xs text-gray-500 mb-4 italic">
          Select any symptoms you are currently experiencing to receive safety and educational guidance.
        </p>

        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Common male urinary symptoms
          </p>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                  selected.includes(s)
                    ? 'bg-man-100 border-man-400 text-man-700 font-semibold shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {selected.includes(s) && '✓ '}
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">
            ⚠ Red flags requiring prompt medical evaluation:
          </p>
          <div className="flex flex-wrap gap-2">
            {redFlags.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                  selected.includes(s)
                    ? 'bg-red-100 border-red-400 text-red-700 font-semibold shadow-sm'
                    : 'bg-red-50 border-red-200 text-red-600 hover:border-red-300'
                )}
              >
                {selected.includes(s) && '✓ '}
                {s}
              </button>
            ))}
          </div>
        </div>

        {selected.length > 0 && (
          <div
            className={cn(
              'mt-6 p-4 rounded-2xl border animate-fade-in',
              hasRed ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-200'
            )}
          >
            {hasRed ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-900">Urgent Medical Evaluation Advised</h4>
                    <p className="text-xs text-red-800 leading-relaxed mt-0.5">
                      You selected one or more clinical red flags (fever, back/flank pain, or blood in urine). In men, these can be signs of upper urinary tract involvement or prostate inflammation requiring immediate professional doctor care.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  You have noted {selected.length} symptom{selected.length > 1 ? 's' : ''}. UTIs are less common in young men, so if symptoms persist beyond 24–48 hours or cause sharp pain, a clinical urinalysis test is recommended.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Study Resources */}
      <div className="card p-6 bg-gradient-to-br from-man-50/70 via-teal-50/40 to-navy-50/30 border-man-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-man-600" />
            <h3 className="font-display font-bold text-base text-gray-900">
              Related Male Study Resources
            </h3>
          </div>
          <Link
            href="/man/education"
            className="text-xs text-man-600 font-semibold hover:text-man-700 flex items-center gap-1"
          >
            View All Guides <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Evidence-informed clinical guides covering male urinary tract anatomy, causes, and daily preventative habits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/man/education"
            className="p-4 bg-white rounded-2xl border border-man-100 hover:border-man-300 transition-all group"
          >
            <span className="badge bg-man-100 text-man-700 text-[10px] mb-1.5">Male Anatomy & UTI</span>
            <h4 className="font-bold text-xs text-gray-900 group-hover:text-man-700 transition-colors line-clamp-1">
              Male UTI Awareness: Symptoms, Causes, and Prevention
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
              Urinary tract infections in boys and men, common risk factors, and myth-busting.
            </p>
          </Link>

          <Link
            href="/man/education"
            className="p-4 bg-white rounded-2xl border border-man-100 hover:border-man-300 transition-all group"
          >
            <span className="badge bg-teal-100 text-teal-700 text-[10px] mb-1.5">Urinary Health Habits</span>
            <h4 className="font-bold text-xs text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-1">
              Hydration & Prevention Strategies
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
              Actionable daily habits and clinical guidance on when to seek urgent medical care.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
