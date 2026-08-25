'use client'

import { Apple, Plus, Droplets, Clock } from 'lucide-react'
import { useState } from 'react'

const mealTypes = [
  { type: 'breakfast', label: 'Breakfast', emoji: '🌅', time: '8:00 AM' },
  { type: 'morning_snack', label: 'Morning Snack', emoji: '🍎', time: '10:30 AM' },
  { type: 'lunch', label: 'Lunch', emoji: '🥗', time: '1:00 PM' },
  { type: 'evening_snack', label: 'Evening Snack', emoji: '🍌', time: '4:30 PM' },
  { type: 'dinner', label: 'Dinner', emoji: '🍽️', time: '7:30 PM' },
]

const mockLogs: Record<string, string[]> = {
  breakfast: ['Oatmeal with berries', 'Green tea'],
  lunch: ['Dal rice', 'Salad'],
}

export default function NutritionPage() {
  const [input, setInput] = useState<Record<string, string>>({})

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title">Nutrition</h2>
        <p className="section-subtitle">Log meals and track your daily nutrition</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mealTypes.map((meal) => {
          const logged = mockLogs[meal.type] ?? []
          return (
            <div key={meal.type} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{meal.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{meal.label}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {meal.time}
                  </div>
                </div>
                {logged.length > 0 && <span className="badge badge-success text-[10px]">Logged</span>}
              </div>
              {logged.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {logged.map((item) => (
                    <span key={item} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-lg font-medium">{item}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  className="input flex-1 text-xs py-2"
                  placeholder={`Add ${meal.label.toLowerCase()} item...`}
                  value={input[meal.type] ?? ''}
                  onChange={(e) => setInput((p) => ({ ...p, [meal.type]: e.target.value }))}
                />
                <button type="button" className="btn bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 btn-sm px-3">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card p-5 bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
        <div className="flex items-center gap-2 mb-2">
          <Apple className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-green-800 text-sm">Nutrition tip for today</span>
        </div>
        <p className="text-xs text-green-700 leading-relaxed">
          You&apos;re in the follicular phase. This is often associated with good energy and appetite. Iron-rich foods (lentils, spinach, tofu) can be especially beneficial after menstruation.
        </p>
      </div>
    </div>
  )
}
