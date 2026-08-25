'use client'

import { useState } from 'react'
import { Brain, AlertCircle, BookOpen, TrendingUp, Plus, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const pcosSymptoms = [
  'Irregular periods', 'Heavy or light periods', 'Facial hair (hirsutism)', 'Acne', 'Oily skin',
  'Hair thinning', 'Weight gain (especially abdomen)', 'Difficulty losing weight', 'Dark skin patches',
  'Mood changes', 'Difficulty sleeping', 'Fatigue',
]

const lifestyleTips = [
  { icon: '🥗', tip: 'A balanced diet with low glycemic foods may help support hormonal balance', category: 'Nutrition' },
  { icon: '🏃', tip: 'Regular moderate exercise may improve insulin sensitivity and overall hormonal health', category: 'Activity' },
  { icon: '😴', tip: 'Quality sleep supports hormonal regulation — aim for 7–9 hours', category: 'Sleep' },
  { icon: '🧘', tip: 'Stress management practices may help regulate cortisol, which can influence hormones', category: 'Stress' },
  { icon: '💧', tip: 'Adequate hydration supports general metabolic and hormonal health', category: 'Hydration' },
]

export default function PCOSPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const toggleSymptom = (s: string) =>
    setSelectedSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">PCOS / PCOD Awareness</h2>
        <p className="section-subtitle">Education, symptom awareness, and lifestyle support</p>
      </div>

      <div className="health-disclaimer">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>CareSphere does <strong>not diagnose PCOS or PCOD</strong>. This section provides health education and symptom awareness only. A proper diagnosis requires evaluation by a qualified healthcare professional.</span>
      </div>

      {/* What is PCOS */}
      <div className="card p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-violet-600" />
          <h3 className="font-display text-lg font-bold text-violet-800">What is PCOS/PCOD?</h3>
        </div>
        <p className="text-sm text-violet-900 leading-relaxed mb-3">
          Polycystic Ovary Syndrome (PCOS) and Polycystic Ovarian Disease (PCOD) are hormonal conditions that can affect people with ovaries. They are associated with hormonal imbalances that can influence the menstrual cycle, fertility, metabolism, and appearance.
        </p>
        <p className="text-sm text-violet-700 leading-relaxed">
          PCOS and PCOD are not the same condition but share overlapping features. A healthcare professional can differentiate between them and provide appropriate evaluation.
        </p>
      </div>

      {/* Symptom awareness tracker */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-woman-500" />
          <h3 className="font-display text-lg font-bold text-gray-900">Symptom Awareness</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4 italic">Select symptoms you&apos;ve noticed for self-awareness tracking. <strong>This is not a diagnostic tool.</strong></p>
        <div className="flex flex-wrap gap-2">
          {pcosSymptoms.map((s) => (
            <button key={s} type="button" onClick={() => toggleSymptom(s)}
              className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                selectedSymptoms.includes(s) ? 'bg-violet-100 border-violet-400 text-violet-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}>
              {selectedSymptoms.includes(s) && '✓ '}{s}
            </button>
          ))}
        </div>
        {selectedSymptoms.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
            You&apos;ve noted {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} for awareness. If you experience multiple symptoms that concern you, speaking with a healthcare professional is a great next step.
          </div>
        )}
      </div>

      {/* Lifestyle tips */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="font-display text-lg font-bold text-gray-900">Lifestyle Support</h3>
        </div>
        <div className="space-y-3">
          {lifestyleTips.map((tip) => (
            <div key={tip.tip} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <span className="text-xl flex-shrink-0">{tip.icon}</span>
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-0.5">{tip.category}</div>
                <div className="text-sm text-gray-700 leading-relaxed">{tip.tip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
