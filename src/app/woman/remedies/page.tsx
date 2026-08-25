'use client'

import { Heart, AlertTriangle, AlertCircle, CheckCircle2, Shield } from 'lucide-react'

const remedySections = [
  {
    title: 'General UTI Self-Care',
    emoji: '💧',
    disclaimer: true,
    items: [
      { text: 'Increase fluid intake — drinking more water may help dilute urine and support the urinary tract', type: 'tip' as const },
      { text: 'Apply a heating pad on low heat to the lower abdomen to help ease discomfort (not on skin directly)', type: 'tip' as const },
      { text: 'Avoid caffeine, alcohol, and acidic beverages which may irritate the bladder', type: 'tip' as const },
      { text: 'Unsweetened cranberry juice or cranberry supplements — evidence is mixed, but some find it helpful', type: 'tip' as const },
      { text: 'Rest and allow your body time to recover', type: 'tip' as const },
      { text: 'If symptoms persist beyond 1–2 days, worsen, or include fever/chills/back pain — seek prompt medical evaluation', type: 'warning' as const },
      { text: 'Do NOT use antibiotics without a prescription — improper use contributes to antibiotic resistance', type: 'warning' as const },
    ],
  },
  {
    title: 'Menstrual Discomfort Self-Care',
    emoji: '🌸',
    disclaimer: false,
    items: [
      { text: 'Apply heat to the lower abdomen or back — warmth may help relax uterine muscle tension', type: 'tip' as const },
      { text: 'Gentle movement or yoga may help some individuals manage cramping', type: 'tip' as const },
      { text: 'Stay hydrated — water and warm herbal teas may reduce bloating and discomfort', type: 'tip' as const },
      { text: 'Magnesium-rich foods (dark chocolate, leafy greens, nuts) may be associated with reduced cramping for some', type: 'tip' as const },
      { text: 'Rest when needed — your body is doing significant work during menstruation', type: 'tip' as const },
      { text: 'Over-the-counter pain relief (e.g., ibuprofen) is commonly used — always follow label instructions. Consult a pharmacist if unsure.', type: 'tip' as const },
      { text: 'Severe menstrual pain that disrupts daily life is worth discussing with a healthcare professional', type: 'warning' as const },
    ],
  },
  {
    title: 'General Wellness Support',
    emoji: '💚',
    disclaimer: false,
    items: [
      { text: 'Prioritize 7–9 hours of sleep — sleep quality affects hormonal regulation significantly', type: 'tip' as const },
      { text: 'Practice stress management techniques you find effective (breathing, journaling, mindfulness)', type: 'tip' as const },
      { text: 'Maintain balanced nutrition — vegetables, protein, complex carbs, and healthy fats', type: 'tip' as const },
      { text: 'Stay socially connected — emotional support contributes to overall wellbeing', type: 'tip' as const },
      { text: 'Take time to notice and record how you feel — self-awareness is foundational to health', type: 'tip' as const },
    ],
  },
]

const WHEN_TO_SEEK_CARE = [
  'Fever, chills, or shaking accompanying urinary symptoms (possible kidney infection)',
  'Blood in urine',
  'Back or flank pain alongside urinary symptoms',
  'Symptoms that worsen or do not improve within 1–2 days',
  'Very severe menstrual pain not responding to typical self-care',
  'Unexplained significant changes in your health or body',
  'Any symptoms that concern or frighten you',
]

export default function RemediesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">General Self-Care</h2>
        <p className="section-subtitle">Evidence-informed self-care guidance — not medical prescriptions</p>
      </div>

      <div className="health-disclaimer">
        <Shield className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>This section provides <strong>general self-care education only</strong>. It does not contain medical prescriptions, diagnostic recommendations, or specific medication instructions. Always consult a healthcare professional for medical concerns.</span>
      </div>

      {remedySections.map((section) => (
        <div key={section.title} className="card p-6">
          <h3 className="font-display text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>{section.emoji}</span>
            {section.title}
          </h3>
          <div className="space-y-3">
            {section.items.map((item, i) => (
              <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${item.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                {item.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm leading-relaxed ${item.type === 'warning' ? 'text-amber-800' : 'text-gray-700'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* When to seek care */}
      <div className="card p-6 border-l-4 border-red-400 bg-red-50">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-display text-lg font-bold text-red-800">When to seek medical care</h3>
        </div>
        <p className="text-sm text-red-700 mb-3">Consider consulting a healthcare professional promptly if you experience:</p>
        <ul className="space-y-2">
          {WHEN_TO_SEEK_CARE.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-red-700">
              <Heart className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
