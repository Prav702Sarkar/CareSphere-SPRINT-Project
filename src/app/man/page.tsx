'use client'

import Link from 'next/link'
import { Shield, BookOpen, Activity, Droplets, ArrowRight, Users, MessageCircle, CheckCircle2 } from 'lucide-react'

const quickLinks = [
  { href: '/man/education', icon: BookOpen, label: 'UTI Education', desc: 'Learn what UTIs are and how they work', color: 'from-man-500 to-teal-500', bg: 'bg-man-50 border-man-100', iconBg: 'bg-man-100', iconColor: 'text-man-600' },
  { href: '/man/symptoms', icon: Activity, label: 'Symptoms', desc: 'Understand common UTI symptoms', color: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50 border-teal-100', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
  { href: '/man/prevention', icon: Shield, label: 'Prevention', desc: 'Learn prevention habits', color: 'from-blue-500 to-man-500', bg: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { href: '/man/self-care', icon: Droplets, label: 'Self-Care', desc: 'General self-care guidance', color: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-50 border-indigo-100', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
]

const keyFacts = [
  'UTIs can occur in males, though less common than in females',
  'Male UTIs may be associated with prostate conditions, urinary anatomy, or other factors',
  'Most UTIs require professional diagnosis and appropriate treatment',
  'Early evaluation is generally better than waiting for symptoms to worsen',
  'Self-medication with antibiotics is not recommended without professional evaluation',
]

export default function ManDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h2 className="font-display text-3xl font-black text-gray-900 mt-1">Welcome to UTI Education</h2>
        <p className="text-gray-500 text-sm mt-1">Learn about urinary health and how to support yourself or a loved one.</p>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-man-700 via-man-600 to-teal-600 p-6 text-white shadow-lg">
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="font-display text-2xl font-black mb-2">UTI Awareness for Men</div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Urinary tract infections can affect anyone. Understanding symptoms, prevention, and when to seek care is important for your health.
            </p>
            <Link href="/man/education" className="btn bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm inline-flex">
              <BookOpen className="w-4 h-4" />
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden sm:flex w-20 h-20 rounded-3xl bg-white/10 items-center justify-center flex-shrink-0">
            <Shield className="w-10 h-10 text-white/80" />
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className={`card-hover p-5 border flex flex-col gap-3 group ${link.bg}`}>
            <div className={`w-10 h-10 rounded-2xl ${link.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <link.icon className={`w-5 h-5 ${link.iconColor}`} />
            </div>
            <div>
              <div className="font-display font-bold text-gray-900 text-sm">{link.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{link.desc}</div>
            </div>
            <ArrowRight className={`w-4 h-4 mt-auto self-start ${link.iconColor} group-hover:translate-x-1 transition-transform`} />
          </Link>
        ))}
      </div>

      {/* Key facts */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Key Facts to Know</h3>
        <div className="space-y-2.5">
          {keyFacts.map((fact) => (
            <div key={fact} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-man-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 leading-relaxed">{fact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loved ones + AI links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/man/loved-ones" className="card-hover p-5 flex items-center gap-3 group border-man-100 bg-man-50">
          <div className="w-10 h-10 rounded-2xl bg-man-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 text-man-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-man-800">Loved Ones</div>
            <div className="text-xs text-man-500 mt-0.5">View shared partner health info</div>
          </div>
          <ArrowRight className="w-4 h-4 text-man-400 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/man/ai-assistant" className="card-hover p-5 flex items-center gap-3 group border-teal-100 bg-teal-50">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-teal-800">AI Assistant</div>
            <div className="text-xs text-teal-500 mt-0.5">Ask UTI education questions</div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
