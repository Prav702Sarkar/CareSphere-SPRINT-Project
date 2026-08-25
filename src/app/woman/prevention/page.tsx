'use client'

import { Shield, CheckCircle2, Droplets, Apple, Moon, Activity, AlertCircle } from 'lucide-react'

const preventionCategories = [
  {
    icon: Droplets,
    title: 'Hydration Habits',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    tips: [
      'Aim to drink 2–2.5 liters of water daily (individual needs vary)',
      'Increase fluid intake in hot weather, during exercise, or during menstruation',
      'Urinate when you feel the urge — avoid holding urine for extended periods',
      'Urinate after sexual activity to help clear the urethra',
      'Cranberry products (unsweetened) may provide some urinary tract support for some individuals — evidence is mixed',
    ],
  },
  {
    icon: Apple,
    title: 'Nutrition & Gut Health',
    color: 'text-green-600',
    bg: 'bg-green-50',
    tips: [
      'Include probiotic-rich foods (yogurt, kefir, fermented vegetables) which may support vaginal and gut flora',
      'Reduce excess sugar which may influence bacterial balance',
      'Eat fiber-rich foods to support digestive regularity',
      'Include anti-inflammatory foods like berries, leafy greens, and omega-3 rich sources',
      'Stay mindful of foods that may irritate the bladder (caffeine, alcohol, spicy foods) if you experience UTI symptoms',
    ],
  },
  {
    icon: Shield,
    title: 'Hygiene Practices',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    tips: [
      'Wipe front-to-back after using the bathroom',
      'Wear breathable cotton underwear when possible',
      'Avoid harsh soaps, douches, or scented products in the vaginal area',
      'Change out of wet swimwear or exercise clothes promptly',
      'Use fragrance-free, gentle cleansers for the external area only',
    ],
  },
  {
    icon: Moon,
    title: 'Sleep & Stress',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    tips: [
      'Aim for 7–9 hours of quality sleep — sleep supports immune function and hormonal balance',
      'Manage stress through practices you find effective (breathing, journaling, movement, social connection)',
      'Elevated chronic stress may be associated with changes in hormonal balance and immune response',
      'Consider a consistent sleep/wake schedule to support circadian rhythm',
    ],
  },
  {
    icon: Activity,
    title: 'Movement & Activity',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    tips: [
      'Regular moderate exercise is associated with overall hormonal and immune health',
      'Pelvic floor exercises may support urinary control and pelvic health',
      'Avoid excessive high-intensity exercise if experiencing menstrual discomfort',
      'Listen to your body\'s signals about what feels appropriate during different cycle phases',
    ],
  },
]

export default function PreventionPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">Prevention</h2>
        <p className="section-subtitle">Build everyday habits that support long-term health</p>
      </div>

      <div className="health-disclaimer">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>These are general wellness guidelines. Individual needs vary. Speak with a healthcare professional for personalized advice.</span>
      </div>

      <div className="space-y-5">
        {preventionCategories.map((cat) => (
          <div key={cat.title} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl ${cat.bg} flex items-center justify-center`}>
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <h3 className={`font-display text-lg font-bold ${cat.color}`}>{cat.title}</h3>
            </div>
            <ul className="space-y-2.5">
              {cat.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
