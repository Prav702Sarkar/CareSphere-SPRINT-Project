'use client'

import { useState } from 'react'
import { Droplets, AlertTriangle, AlertCircle, Plus, Clock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const utiSymptoms = [
  'Burning sensation during urination',
  'Frequent urge to urinate',
  'Cloudy or strong-smelling urine',
  'Passing small amounts of urine frequently',
  'Pelvic pressure or discomfort',
  'Mild lower abdominal discomfort',
]

const redFlagSymptoms = [
  'Fever or chills',
  'Back or flank pain',
  'Nausea or vomiting',
  'Blood in urine',
  'Symptoms worsening after 1-2 days',
]

const preventionTips = [
  'Drink adequate water daily (2–2.5L or more)',
  'Urinate after sexual activity',
  'Wipe front-to-back after bathroom use',
  'Avoid holding urine for extended periods',
  'Wear breathable cotton underwear',
  'Avoid harsh soaps or douches near the urethra',
]

export default function UTIPage() {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (s: string) => setSelected((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])
  const hasRedFlag = selected.some((s) => redFlagSymptoms.includes(s))

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">UTI Awareness</h2>
        <p className="section-subtitle">Track, understand, and prevent urinary tract issues</p>
      </div>

      <div className="health-disclaimer">
        <Shield className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>This page provides <strong>UTI education and symptom awareness only</strong>. UTIs require professional diagnosis and treatment. Do not self-medicate with antibiotics.</span>
      </div>

      {/* Symptom checker */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold text-gray-900 mb-2">Symptom Awareness Check</h3>
        <p className="text-xs text-gray-500 mb-4 italic">Select symptoms you&apos;re currently experiencing. <strong>Not a diagnosis tool.</strong></p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Common UTI symptoms</p>
          <div className="flex flex-wrap gap-2">
            {utiSymptoms.map((s) => (
              <button key={s} type="button" onClick={() => toggle(s)}
                className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                  selected.includes(s) ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                )}>
                {selected.includes(s) && '✓ '}{s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">⚠ Seek prompt care if experiencing:</p>
          <div className="flex flex-wrap gap-2">
            {redFlagSymptoms.map((s) => (
              <button key={s} type="button" onClick={() => toggle(s)}
                className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                  selected.includes(s) ? 'bg-red-100 border-red-400 text-red-700' : 'bg-red-50 border-red-200 text-red-600 hover:border-red-300'
                )}>
                {selected.includes(s) && '✓ '}{s}
              </button>
            ))}
          </div>
        </div>

        {selected.length > 0 && (
          <div className={cn('mt-4 p-4 rounded-xl border animate-fade-in', hasRedFlag ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-200')}>
            {hasRedFlag ? (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">Please seek medical care promptly</p>
                  <p className="text-xs text-red-700 mt-1">The symptoms you&apos;ve selected may indicate a more serious condition such as a kidney infection. A healthcare professional should evaluate these symptoms promptly.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">You&apos;ve noted {selected.length} symptom{selected.length > 1 ? 's' : ''}. If these persist for more than 1–2 days, worsen, or you feel unwell, consulting a healthcare professional is advisable.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prevention */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-blue-500" />
          <h3 className="font-display text-lg font-bold text-gray-900">Prevention Tips</h3>
        </div>
        <div className="space-y-2.5">
          {preventionTips.map((tip) => (
            <div key={tip} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <span className="text-sm text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
