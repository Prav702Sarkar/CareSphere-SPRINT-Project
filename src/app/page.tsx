'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'
import {
  Heart, Shield, BookOpen, Sparkles, ArrowRight, CheckCircle2,
  ChevronDown, Star, Users, Droplets, Bell, Lock, Brain,
  Activity, Moon, Apple, Zap, MessageCircle, Eye, EyeOff,
  HeartHandshake, ChevronRight, Menu, X
} from 'lucide-react'

// ============================================================
// CONSTANTS
// ============================================================

const pillars = [
  {
    icon: Activity,
    title: 'Symptoms',
    tagline: 'Understand what your body is telling you.',
    description:
      'Log and track symptoms with severity, duration, and frequency. Identify patterns across menstrual health, PCOS/PCOD, and UTI concerns — all in one place.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    features: ['Symptom history', 'Severity tracking', 'Pattern detection', 'UTI awareness'],
  },
  {
    icon: Shield,
    title: 'Prevention',
    tagline: 'Build healthier everyday habits.',
    description:
      'Get personalized prevention guidance for UTIs, PCOS, and general women\'s wellness. Small daily habits create lasting health outcomes.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    features: ['Hydration habits', 'Lifestyle guidance', 'Nutrition tips', 'Sleep & activity'],
  },
  {
    icon: BookOpen,
    title: 'Education',
    tagline: 'Learn about women\'s health and UTI awareness.',
    description:
      'Evidence-based educational content on UTI, PCOS, PCOD, menstrual health, and nutrition. Knowledge is the foundation of good health.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    features: ['UTI education', 'PCOS/PCOD content', 'Cycle education', 'Nutrition guides'],
  },
  {
    icon: Heart,
    title: 'Remedies',
    tagline: 'Get personalized general self-care guidance.',
    description:
      'Safe, general self-care information for managing discomfort and supporting wellness. Always know when to seek professional medical care.',
    color: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    features: ['Self-care tips', 'Escalation guidance', 'Comfort measures', 'Wellness habits'],
  },
]

const features = [
  { icon: Moon, label: 'Cycle Tracking', desc: 'Log periods, predict phases, track mood & flow' },
  { icon: Brain, label: 'PCOS/PCOD Awareness', desc: 'Education, symptom awareness & lifestyle guidance' },
  { icon: Droplets, label: 'Water Reminders', desc: 'Track hydration with custom reminder scheduling' },
  { icon: Apple, label: 'Food Reminders', desc: 'Personalized meal reminders & nutrition logging' },
  { icon: MessageCircle, label: 'AI Health Assistant', desc: 'Intelligent educational chat, not a diagnosis tool' },
  { icon: HeartHandshake, label: 'Loved Ones', desc: 'Consent-based sharing with your trusted people' },
  { icon: Zap, label: 'Insights Engine', desc: 'Weekly & monthly wellness trend analysis' },
  { icon: Bell, label: 'Smart Reminders', desc: 'Browser + in-app notifications for all your routines' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Sign in with Google',
    desc: 'One-click sign-in through Google. Your identity is secured by Clerk.',
  },
  {
    step: '02',
    title: 'Complete your profile',
    desc: 'A short onboarding flow personalizes your experience to your unique health profile.',
  },
  {
    step: '03',
    title: 'Explore your dashboard',
    desc: 'Access your full health dashboard — symptoms, cycle, nutrition, AI assistant and more.',
  },
  {
    step: '04',
    title: 'Share with loved ones',
    desc: 'Optionally invite a partner or loved one with full control over what they can see.',
  },
]

const faqs = [
  {
    q: 'Is CareSphere a medical diagnostic tool?',
    a: 'No. CareSphere is a health education and wellness awareness platform. It does not diagnose conditions, prescribe medication, or replace professional medical advice. All AI responses include appropriate disclaimers.',
  },
  {
    q: 'How is my health data protected?',
    a: 'Your data is stored in a secure, encrypted database with Row Level Security (RLS). Only you can access your data by default. Partner access requires your explicit consent and a one-time verification process.',
  },
  {
    q: 'What can a partner or loved one see?',
    a: 'Absolutely nothing without your explicit consent. You decide exactly which categories of information to share — cycle status, UTI info, hydration, and more. You can revoke access at any time.',
  },
  {
    q: 'Is the AI chatbot actually a doctor?',
    a: 'No. The AI assistant is an educational tool powered by Groq AI. It provides health education, symptom awareness, and general self-care guidance. It clearly distinguishes between education and medical diagnosis.',
  },
  {
    q: 'Why is there a separate experience for boys/men?',
    a: 'Men can also get UTIs and may want to support a partner\'s health journey. The male experience focuses on UTI education and a consent-based view of a partner\'s shared health information.',
  },
  {
    q: 'Does CareSphere include nearby doctors or prescriptions?',
    a: 'No. CareSphere intentionally does not include doctor directories, appointment booking, or prescription recommendations. When professional care may be needed, we provide appropriate escalation guidance.',
  },
]

// ============================================================
// SUBCOMPONENTS
// ============================================================

function Navbar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const { isSignedIn } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">CareSphere</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#pillars" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#ai" className="hover:text-gray-900 transition-colors">AI Assistant</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link href="/select-role" className="btn btn-primary-woman text-sm">
                  Go to Health Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="btn btn-secondary text-sm">Sign in</Link>
                <Link href="/sign-up" className="btn btn-primary-woman text-sm">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 space-y-2 animate-slide-up">
          <a href="#pillars" className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#ai" className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>AI Assistant</a>
          <a href="#faq" className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>FAQ</a>
          <div className="pt-2 flex gap-2">
            {isSignedIn ? (
              <Link href="/onboarding" className="flex-1 btn btn-primary-woman text-sm justify-center" onClick={() => setMobileOpen(false)}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="flex-1 btn btn-secondary text-sm justify-center" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link href="/sign-up" className="flex-1 btn btn-primary-woman text-sm justify-center" onClick={() => setMobileOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200">
      <button
        type="button"
        suppressHydrationWarning
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm pr-8">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4 bg-gray-50/50 animate-fade-in">
          {a}
        </div>
      )}
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* ========== HERO ========== */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        {/* Background gradients */}
        <div className="hero-glow w-[600px] h-[600px] bg-woman-400 -top-40 -left-40" />
        <div className="hero-glow w-[400px] h-[400px] bg-rose-400 top-10 -right-20" />
        <div className="hero-glow w-[300px] h-[300px] bg-peach-400 bottom-0 left-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-woman-50 border border-woman-200 text-woman-700 text-xs font-semibold mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Women's Health & UTI Awareness Platform
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight animate-slide-up">
              Your health,{' '}
              <span className="text-gradient-woman">understood.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
              CareSphere helps you understand symptoms, build prevention habits, learn about women's health and UTIs, and get personalized wellness guidance — all backed by AI education, not AI diagnosis.
            </p>

            {/* Single CTA Button */}
            <div className="flex justify-center items-center mb-12 animate-slide-up">
              <Link
                href={isSignedIn ? '/select-role' : '/sign-up'}
                className="btn btn-primary-woman btn-lg shadow-lg hover:shadow-xl group"
                id="cta-get-started-btn"
              >
                <Sparkles className="w-5 h-5" />
                {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500 animate-fade-in">
              {[
                'No doctor diagnosis',
                'Privacy-first',
                'Consent-based sharing',
                'Free to use',
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero dashboard preview */}
          <div className="mt-16 relative max-w-5xl mx-auto animate-fade-in">
            <div className="relative bg-gradient-to-br from-woman-50 via-rose-50 to-peach-50 rounded-3xl p-1 shadow-2xl border border-white">
              <div className="bg-white rounded-3xl p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Cycle Day', value: '14', sub: 'Estimated fertile window', color: 'from-rose-400 to-pink-500' },
                    { label: 'Water Today', value: '6/8', sub: 'Glasses logged', color: 'from-blue-400 to-cyan-500' },
                    { label: 'Symptoms', value: '2', sub: 'Logged this week', color: 'from-woman-400 to-violet-500' },
                    { label: 'Insights', value: '3', sub: 'New this month', color: 'from-amber-400 to-orange-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="card p-4 text-center">
                      <div className={`text-2xl font-display font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="font-semibold text-xs text-gray-800 mt-1">{stat.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Mini chat preview */}
                <div className="bg-gradient-to-br from-gray-50 to-woman-50/30 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">AI Health Education Assistant</span>
                    <span className="ml-auto badge badge-success text-[10px]">Education only</span>
                  </div>
                  <div className="space-y-2">
                    <div className="chat-bubble-user text-xs py-2 px-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-woman-500 to-rose-500 text-white w-fit ml-auto">
                      What are common signs of a UTI?
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 p-3 text-xs text-gray-700 shadow-sm max-w-xs">
                      UTI symptoms may include a burning sensation during urination, frequent urge to urinate, and cloudy urine. These can have various causes — consider speaking with a healthcare professional for evaluation. 💙
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating pills */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 bg-white rounded-2xl shadow-card px-4 py-2.5 border border-gray-100 animate-float">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-gray-700">Cycle: Follicular Phase</span>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 bg-white rounded-2xl shadow-card px-4 py-2.5 border border-gray-100 animate-float" style={{ animationDelay: '1.5s' }}>
              <Lock className="w-3.5 h-3.5 text-woman-600" />
              <span className="text-xs font-semibold text-gray-700">Your data is private & secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOUR PILLARS ========== */}
      <section id="pillars" className="py-20 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-woman-100 text-woman-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" />
              Core Pillars
            </div>
            <h2 className="font-display text-4xl font-black text-gray-900">
              Understand → Prevent → Learn → Care
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Everything in CareSphere is built around four foundational health pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="pillar-card group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${pillar.iconBg} flex items-center justify-center mb-5`}>
                  <pillar.icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">{pillar.title}</h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent mb-3`}>
                  {pillar.tagline}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{pillar.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pillar.features.map((f) => (
                    <span key={f} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ALL FEATURES ========== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-black text-gray-900">Everything you need</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              A complete wellness companion built around your unique health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.label} className="card-hover p-5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-woman-100 to-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <f.icon className="w-5 h-5 text-woman-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-woman-50 via-rose-50/50 to-peach-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-black text-gray-900">How CareSphere works</h2>
            <p className="text-gray-500 mt-3">Getting started takes less than 2 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-woman-200 via-rose-300 to-peach-200" />

            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white shadow-card border border-gray-100 flex items-center justify-center mx-auto mb-5">
                  <span className="font-display text-xl font-black text-gradient-woman">{step.step}</span>
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AI SECTION ========== */}
      <section id="ai" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-6">
                <Brain className="w-3 h-3" />
                Powered by Groq AI
              </div>
              <h2 className="font-display text-4xl font-black text-gray-900 mb-5">
                An AI assistant that{' '}
                <span className="text-gradient-woman">educates, not diagnoses</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                CareSphere's AI Health Education Assistant is trained on health education context — not to replace doctors, but to help you understand your body better. It provides personalized educational guidance based on your health profile.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: CheckCircle2, text: 'Personalized to your cycle, symptoms & lifestyle', color: 'text-green-500' },
                  { icon: CheckCircle2, text: 'Different experience for women vs. UTI education for men', color: 'text-green-500' },
                  { icon: CheckCircle2, text: 'Safety layer prevents medical claims or prescriptions', color: 'text-green-500' },
                  { icon: CheckCircle2, text: 'Directs to professional care when appropriate', color: 'text-green-500' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-2.5">
                    <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="health-disclaimer">
                <Shield className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <span>CareSphere AI provides health <strong>education only</strong>. Always consult a qualified healthcare professional for medical advice, diagnosis or treatment.</span>
              </div>
            </div>

            {/* Chat demo */}
            <div className="bg-gradient-to-br from-gray-50 to-woman-50/30 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center shadow-md">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">AI Health Education Assistant</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Online · Education mode
                  </div>
                </div>
              </div>

              <div className="space-y-4 min-h-[240px]">
                {[
                  { role: 'user', msg: 'I\'ve been feeling bloated and having irregular periods. Should I be worried?' },
                  {
                    role: 'assistant',
                    msg: 'Bloating and irregular periods can have several causes — stress, dietary changes, hormonal fluctuations, or occasionally conditions like PCOS. These symptoms are worth monitoring. I can help you track them and provide educational information about possible contributing factors. For a proper evaluation, speaking with a healthcare professional would be appropriate. Would you like to learn more about cycle irregularity or log your symptoms?'
                  },
                  { role: 'user', msg: 'Yes, tell me more about PCOS.' },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={msg.role === 'user' ? 'chat-bubble-user text-sm' : 'chat-bubble-assistant text-sm'}>
                      {msg.msg}
                    </div>
                  </div>
                ))}
                <div className="flex justify-start">
                  <div className="chat-bubble-assistant text-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
                <input
                  suppressHydrationWarning
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed"
                  placeholder="Ask anything about your health..."
                  disabled
                />
                <button type="button" suppressHydrationWarning className="btn btn-primary-woman btn-sm" disabled>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LOVED ONES & PRIVACY ========== */}
      <section className="py-20 bg-gradient-to-br from-navy-950 via-navy-900 to-man-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* Permission card visual */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="text-white font-semibold text-sm mb-5">Shared Health Permissions</div>
                <div className="space-y-3">
                  {[
                    { label: 'Cycle Status', allowed: true },
                    { label: 'Period Dates', allowed: true },
                    { label: 'UTI Information', allowed: false },
                    { label: 'PCOS/PCOD Details', allowed: false },
                    { label: 'Hydration Levels', allowed: true },
                    { label: 'Symptom History', allowed: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-sm text-white/90">{item.label}</span>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${item.allowed ? 'text-green-400' : 'text-white/40'}`}>
                        {item.allowed ? (
                          <><Eye className="w-3.5 h-3.5" /> Shared</>
                        ) : (
                          <><EyeOff className="w-3.5 h-3.5" /> Private</>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-man-500/20 border border-man-400/20 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-man-300" />
                  <span className="text-xs text-white/80">Partner access requires OTP verification</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-man-500/20 text-man-300 text-xs font-semibold mb-6 border border-man-500/20">
                <HeartHandshake className="w-3 h-3" />
                Loved Ones & Privacy
              </div>
              <h2 className="font-display text-4xl font-black text-white mb-5">
                Share only what{' '}
                <span className="text-gradient-man">you choose</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                The Loved Ones feature lets you invite a partner, parent, or sibling to view selected health information. Every category requires your explicit permission, and you can revoke access instantly.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Partner requests access → you approve or deny',
                  'One-time OTP verification adds a second layer',
                  'You choose exactly which categories to share',
                  'Private information stays 100% private',
                  'Revoke access any time, instantly',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <ChevronRight className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">{point}</span>
                  </div>
                ))}
              </div>
              <Link href="/sign-up" className="btn btn-lg bg-white text-navy-900 hover:bg-white/90 font-bold">
                Get started — it's free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-black text-gray-900">Frequently asked questions</h2>
            <p className="text-gray-500 mt-3">Everything you need to know about CareSphere.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 bg-gradient-to-br from-woman-50 via-rose-50 to-peach-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="font-display text-5xl font-black text-gray-900 mb-5">
            Start your health journey today
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            Join CareSphere and take a more informed, empowered approach to your health and wellness.
          </p>
          <div className="flex justify-center">
            <Link
              href={isSignedIn ? '/select-role' : '/sign-up'}
              className="btn btn-primary-woman btn-lg shadow-lg group"
              id="final-cta-btn"
            >
              <Sparkles className="w-5 h-5" />
              {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Sign in with Google · No credit card required · Health education, not medical diagnosis
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-woman-500 to-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-lg">CareSphere</span>
            </div>
            <p className="text-sm text-gray-400 text-center">
              CareSphere is a health education platform. It is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Lock className="w-3 h-3" />
              Privacy-first · Secure · Consent-based
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
