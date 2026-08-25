import { supabaseAdmin } from '@/lib/supabase/server'
import type { HealthArticle, TargetExperience, ArticleCategory } from '@/types'

export interface RecommendationParams {
  userExperience: 'women' | 'boys'
  symptoms?: string[]
  healthConcerns?: string[]
  cyclePhase?: string
  limit?: number
}

/**
 * Personalized Health Study Article Recommendation Engine
 */
export async function getPersonalizedArticleRecommendations(
  params: RecommendationParams
): Promise<HealthArticle[]> {
  const { userExperience, symptoms = [], healthConcerns = [], cyclePhase, limit = 6 } = params

  try {
    const { data: dbArticles, error } = await supabaseAdmin
      .from('health_articles')
      .select('*')
      .eq('is_active', true)
      .or(`target_experience.eq.${userExperience},target_experience.eq.both`)

    if (error || !dbArticles || dbArticles.length === 0) {
      return []
    }

    // Build keyword matching criteria from symptoms + health concerns + cycle phase
    const userTokens = [
      ...symptoms.map((s) => s.toLowerCase()),
      ...healthConcerns.map((c) => c.toLowerCase()),
      ...(cyclePhase ? [cyclePhase.toLowerCase()] : []),
    ]

    // Score each article based on personalization signals
    const scoredArticles = dbArticles.map((article: HealthArticle) => {
      let score = 10 // Baseline score

      const articleTopics = (article.topics || []).map((t) => t.toLowerCase())
      const articleTags = (article.tags || []).map((t) => t.toLowerCase())
      const contentLower = `${article.title} ${article.summary} ${article.content}`.toLowerCase()

      // Target experience exact match boost
      if (article.target_experience === userExperience) {
        score += 5
      }

      // Match symptoms against article topics & tags
      for (const token of userTokens) {
        if (!token) continue
        if (articleTopics.includes(token)) score += 15
        if (articleTags.some((tag) => tag.includes(token))) score += 10
        if (contentLower.includes(token)) score += 5
      }

      // Specific category alignments
      if (userExperience === 'boys') {
        if (article.category === 'boys_uti_education') score += 20
        if (article.category === 'prevention') score += 10
      } else {
        if (symptoms.some((s) => s.toLowerCase().includes('uti')) && article.category === 'uti') {
          score += 25
        }
        if (
          healthConcerns.some((c) => c.toLowerCase().includes('pcos') || c.toLowerCase().includes('pcod')) &&
          article.category === 'pcos_pcod'
        ) {
          score += 25
        }
        if (cyclePhase && article.category === 'menstrual_health') {
          score += 15
        }
      }

      return {
        ...article,
        recommendationScore: score,
      }
    })

    return scoredArticles
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit)
  } catch (err) {
    console.error('[Article Recommendation Engine Error]', err)
    return []
  }
}
