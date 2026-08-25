'use client'
import { Droplets, CheckCircle2, AlertTriangle, Shield } from 'lucide-react'
const tips = [
  { tip: 'Increase water intake — aim for 2–2.5L per day', type: 'tip' as const },
  { tip: 'Rest when needed to support your body\'s recovery', type: 'tip' as const },
  { tip: 'Avoid caffeine and alcohol which may irritate the bladder', type: 'tip' as const },
  { tip: 'Apply warmth (warm compress on low heat) to the lower abdomen for discomfort', type: 'tip' as const },
  { tip: 'Avoid holding urine — urinate whenever you feel the urge', type: 'tip' as const },
  { tip: 'Do NOT self-medicate with antibiotics — this requires professional evaluation and prescription', type: 'warning' as const },
  { tip: 'Do NOT ignore symptoms that persist beyond 1–2 days — seek medical evaluation', type: 'warning' as const },
  { tip: 'Seek prompt medical care if you develop fever, chills, or back/flank pain', type: 'warning' as const },
]
export default function ManSelfCarePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div><h2 className="section-title">General Self-Care</h2><p className="section-subtitle">Non-prescription self-care guidance for UTI awareness</p></div>
      <div className="health-disclaimer"><Shield className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" /><span>This section provides general self-care education only. UTIs typically require professional evaluation and may need prescription treatment. Do not self-medicate.</span></div>
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold text-gray-900 mb-4">General Self-Care Tips</h3>
        <div className="space-y-3">
          {tips.map((item, i) => (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${item.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
              {item.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-man-500 flex-shrink-0 mt-0.5" />}
              <span className={`text-sm leading-relaxed ${item.type === 'warning' ? 'text-amber-800' : 'text-gray-700'}`}>{item.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
