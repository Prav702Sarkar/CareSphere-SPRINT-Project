'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen, Droplets, AlertTriangle, CheckCircle2, ChevronDown,
  Search, Sparkles, Clock, Tag, ExternalLink, X, Shield, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HealthArticle } from '@/types'

const CATEGORY_TABS: { id: string; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Resources', emoji: '📚' },
  { id: 'boys_uti_education', label: 'Male UTI Education', emoji: '🔬' },
  { id: 'prevention', label: 'Prevention Habits', emoji: '🛡️' },
  { id: 'nutrition', label: 'Hydration & Nutrition', emoji: '💧' },
]

export default function ManEducationPage() {
  const [articles, setArticles] = useState<HealthArticle[]>([])
  const [personalizedArticles, setPersonalizedArticles] = useState<HealthArticle[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Fetch recommendations for boys
        const recRes = await fetch('/api/articles?experience=boys&personalized=true')
        const recData = await recRes.json()
        if (recData.articles) {
          setPersonalizedArticles(recData.articles)
        }

        // Fetch general articles list
        const listRes = await fetch(`/api/articles?experience=boys&category=${activeCategory}`)
        const listData = await listRes.json()
        if (listData.articles) {
          setArticles(listData.articles)
        }
      } catch (err) {
        console.error('[Man Education Page Error]', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeCategory])

  const filteredArticles = articles.filter((a) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags?.some((t) => t.toLowerCase().includes(q))
    )
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="section-title">UTI Education & Study Resources</h2>
        <p className="section-subtitle">
          Evidence-based guides, symptoms awareness, prevention, and myth-busting for boys and men
        </p>
      </div>

      {/* Safety Disclaimer */}
      <div className="health-disclaimer">
        <Shield className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <span>
          This section provides <strong>health education and awareness only</strong>. It is not a substitute for clinical medical evaluation or treatment. Antibiotic medications require a prescription from a licensed doctor.
        </span>
      </div>

      {/* Recommendations */}
      {personalizedArticles.length > 0 && (
        <div className="card p-6 bg-gradient-to-br from-man-50 via-teal-50/50 to-navy-50/30 border-man-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-man-600 animate-pulse" />
            <h3 className="font-display text-lg font-bold text-man-900">
              Recommended Study Guides for You
            </h3>
          </div>
          <p className="text-xs text-man-700 mb-4">
            Curated study resources focused on male urinary tract wellness and symptoms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personalizedArticles.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className="card-hover p-4 bg-white/90 border border-man-100 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-man-600 font-semibold mb-1">
                    <span className="badge bg-man-100 text-man-700 text-[10px]">Study Resource</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      {item.read_time_minutes || 4} min read
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-gray-900 line-clamp-1 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.summary}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-man-600 font-medium mt-3">
                  Read Study Guide <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className="input-man pl-10"
            placeholder="Search study articles by topic, symptom, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-150',
                activeCategory === tab.id
                  ? 'bg-man-100 border-man-400 text-man-800 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No study resources found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="card-hover p-5 border flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="badge bg-gray-100 text-gray-700 capitalize">
                      {article.category?.replace(/_/g, ' ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.read_time_minutes || 4} min
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-gray-900 text-base mb-2 group-hover:text-man-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 truncate max-w-[180px]">
                    Source: {article.source || 'Clinical Guidelines'}
                  </span>
                  <span className="text-xs text-man-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read <ArrowRight className="w-3 3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-modal animate-scale-in max-h-[88vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="badge bg-man-100 text-man-700 text-[11px] mb-2">
                  {selectedArticle.category?.replace(/_/g, ' ')}
                </span>
                <h2 className="font-display text-2xl font-black text-gray-900">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedArticle.read_time_minutes || 4} min read
                  </span>
                  <span>·</span>
                  <span>Source: {selectedArticle.source}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-man-50/50 border border-man-100 text-xs text-man-800 italic leading-relaxed">
              &ldquo;{selectedArticle.summary}&rdquo;
            </div>

            {/* Article Content */}
            <div className="prose prose-sm text-gray-700 leading-relaxed whitespace-pre-wrap space-y-4">
              {selectedArticle.content}
            </div>

            {/* Tags */}
            {selectedArticle.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-gray-100">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar: Ask AI & Source Link */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <Link
                href={`/man/ai-assistant?prompt=${encodeURIComponent(`Tell me more about ${selectedArticle.title} and what preventative steps are recommended.`)}`}
                className="btn btn-primary-man btn-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Ask AI Assistant About This
              </Link>
              {selectedArticle.source_url && (
                <a
                  href={selectedArticle.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-man-600 hover:text-man-700 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Clinical Reference
                </a>
              )}
            </div>

            {/* Footer Disclaimer */}
            <div className="mt-4">
              <div className="health-disclaimer text-[11px]">
                <Shield className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
                <span>
                  This resource is for health awareness and self-education only. Always consult a healthcare professional for diagnosis and prescription medication.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
