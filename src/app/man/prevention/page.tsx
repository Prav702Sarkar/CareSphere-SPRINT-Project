'use client'
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react'
const tips = [
  'Drink 2–2.5 liters of water daily to support urinary health',
  'Urinate when you feel the urge — do not hold for extended periods',
  'Urinate after sexual activity to help clear the urethra',
  'Maintain good personal hygiene in the genital area',
  'Wear breathable, clean underwear changed daily',
  'Manage underlying conditions (diabetes, BPH) with professional guidance',
  'Avoid unnecessary use of urinary catheters; if required, ensure proper sterile technique',
  'Eat a balanced diet and maintain a healthy weight',
]
export default function ManPreventionPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div><h2 className="section-title">UTI Prevention</h2><p className="section-subtitle">Habits and practices that may support urinary health</p></div>
      <div className="health-disclaimer"><AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" /><span>These are general wellness guidelines. Individual needs vary — speak with a healthcare professional for personalized advice.</span></div>
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-man-500" /><h3 className="font-display text-lg font-bold text-gray-900">Prevention Tips</h3></div>
        <div className="space-y-3">
          {tips.map((tip) => (
            <div key={tip} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-man-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
