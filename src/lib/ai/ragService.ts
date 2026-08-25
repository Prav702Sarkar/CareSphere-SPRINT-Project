import { supabaseAdmin } from '@/lib/supabase/server'
import type { HealthArticle, RAGSearchResult, TargetExperience, ArticleCategory } from '@/types'

// Rich pre-seeded fallback knowledge in memory covering core & adjacent health topics
const FALLBACK_KNOWLEDGE_BASE: Omit<HealthArticle, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: 'Understanding Urinary Tract Infections (UTIs) in Women',
    slug: 'understanding-utis-in-women',
    summary: 'Causes, female anatomy, early symptoms, and evidence-based self-care.',
    content: 'UTIs in women are commonly caused by uropathogenic E. coli bacteria entering the shorter female urethra. Symptoms include burning during urination (dysuria), urinary frequency, urgent sensation, and lower pelvic pressure. Prevention includes drinking 2-2.5L water daily, urinating promptly after sexual intercourse, wiping front-to-back, and wearing breathable cotton undergarments. Seek prompt medical care if fever, back/flank pain, or blood in urine occurs.',
    category: 'uti',
    topics: ['burning', 'frequency', 'cloudy urine', 'pelvic pain', 'urination', 'uti', 'bladder infection'],
    target_experience: 'women',
    tags: ['UTI', 'Urinary Health', 'Bladder', 'Hygiene'],
    read_time_minutes: 5,
    source: 'American Urological Association & WHO Guidelines',
    source_url: 'https://www.urologyhealth.org',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'Male UTI Awareness: Symptoms, Causes, and Prevention',
    slug: 'male-uti-awareness-and-prevention',
    summary: 'Urinary tract infections in boys and men, common risk factors, and myth-busting.',
    content: 'Male UTIs are less common due to longer male urethral anatomy but require medical evaluation when they occur. Symptoms include burning during urination, frequent urge, cloudy urine, and hesitancy. Risk factors include dehydration, prostate enlargement, sexual activity, or catheter use. Antibiotic treatment requires a prescription. Preventative measures include high water intake and good hygiene.',
    category: 'boys_uti_education',
    topics: ['burning', 'frequency', 'difficulty urinating', 'male uti', 'cloudy urine', 'prostate'],
    target_experience: 'boys',
    tags: ['Male Health', 'UTI', 'Urinary Education', 'Prevention'],
    read_time_minutes: 4,
    source: 'National Institute of Diabetes and Digestive and Kidney Diseases',
    source_url: 'https://www.niddk.nih.gov',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'PCOS & PCOD: Hormonal Pathways, Symptoms, and Lifestyle Management',
    slug: 'pcos-pcod-hormonal-pathways-and-management',
    summary: 'Understanding polycystic ovary syndrome, insulin sensitivity, and holistic lifestyle strategies.',
    content: 'PCOS is an endocrine disorder characterized by irregular periods, elevated androgens (facial hair, acne, hair thinning), and metabolic factors like insulin resistance. Inositol (myo-inositol and D-chiro-inositol in a 40:1 ratio) supports cellular insulin signaling and ovarian function. Lifestyle support includes low-glycemic nutrition, strength training for insulin sensitivity, 7-9 hours of restorative sleep, and stress reduction. Clinical diagnosis is required by a healthcare professional.',
    category: 'pcos_pcod',
    topics: ['irregular periods', 'acne', 'facial hair', 'weight gain', 'hair loss', 'pcos', 'pcod', 'inositol', 'insulin'],
    target_experience: 'women',
    tags: ['PCOS', 'PCOD', 'Hormones', 'Insulin Resistance', 'Metabolism', 'Inositol'],
    read_time_minutes: 6,
    source: 'Endocrine Society Clinical Practice Guidelines',
    source_url: 'https://www.endocrine.org',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'The Four Menstrual Cycle Phases: Energy, Mood, and Physiology',
    slug: 'four-menstrual-cycle-phases',
    summary: 'Explore the physiological shifts across menstrual, follicular, ovulatory, and luteal phases.',
    content: 'Menstrual cycle phases: 1) Menstrual (Days 1-5, baseline hormones, rest & iron-rich nutrition), 2) Follicular (Days 6-13, rising estrogen, increased physical & cognitive energy, supports vaginal Lactobacillus balance), 3) Ovulatory (Day ~14, LH surge & peak estrogen, fertile window, possible brief Mittelschmerz pelvic twinge), 4) Luteal (Days 15-28, rising progesterone, higher basal temperature, magnesium & B6 support PMS comfort and neurotransmitter synthesis).',
    category: 'menstrual_health',
    topics: ['cramps', 'mood', 'energy', 'period', 'cycle', 'ovulation', 'follicular', 'luteal', 'mittelschmerz', 'progesterone', 'estrogen'],
    target_experience: 'women',
    tags: ['Menstrual Cycle', 'Hormones', 'Ovulation', 'Wellness', 'Self-Care', 'Phases'],
    read_time_minutes: 5,
    source: 'American College of Obstetricians and Gynecologists (ACOG)',
    source_url: 'https://www.acog.org',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'Targeted Nutrients & Supplements for Cramps, PMS, and Bladder Health',
    slug: 'nutrients-supplements-cramps-pms-bladder',
    summary: 'Scientific mechanisms of Magnesium, Inositol, D-Mannose, Zinc, Vitamin B6, and Cranberry PACs.',
    content: 'Evidence-backed nutritional mechanisms: 1) Magnesium relaxes uterine smooth muscle by moderating prostaglandins, easing menstrual cramps. 2) Vitamin B6 assists serotonin/dopamine synthesis for luteal mood stability. 3) D-Mannose is a natural simple sugar that binds to type-1 pili of E. coli bacteria, helping wash them out in urine. 4) Cranberry Proanthocyanidins (PACs) reduce bacterial adherence to bladder epithelial walls. 5) Zinc and Omega-3 fatty acids lower systemic inflammation and support skin health.',
    category: 'nutrition',
    topics: ['magnesium', 'cramps', 'd-mannose', 'cranberry', 'supplements', 'inositol', 'vitamin b6', 'zinc', 'omega 3', 'pms', 'bloating'],
    target_experience: 'both',
    tags: ['Supplements', 'Nutrition', 'Magnesium', 'D-Mannose', 'Cramps', 'PMS'],
    read_time_minutes: 5,
    source: 'European Journal of Obstetrics & Gynecology / NIH Office of Dietary Supplements',
    source_url: 'https://ods.od.nih.gov',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'Stress, Cortisol, and Cycle Irregularity: The HPA-HPG Axis',
    slug: 'stress-cortisol-cycle-irregularity',
    summary: 'How emotional or physical stress delays ovulation and alters menstrual timing.',
    content: 'Elevated cortisol from acute or chronic stress suppresses Gonadotropin-Releasing Hormone (GnRH) in the hypothalamus. This delays the luteinizing hormone (LH) surge, postponing or skipping ovulation. When ovulation is delayed, the entire cycle extends. Supporting the nervous system through consistent sleep, adequate caloric intake, and adaptogenic wellness habits helps restore regular hypothalamic-pituitary-ovarian signaling.',
    category: 'menstrual_health',
    topics: ['stress', 'cortisol', 'late period', 'delayed period', 'irregular cycle', 'missed period', 'anxiety'],
    target_experience: 'women',
    tags: ['Stress', 'Cortisol', 'Hormones', 'Late Period', 'Hypothalamus'],
    read_time_minutes: 4,
    source: 'Journal of Clinical Endocrinology & Metabolism',
    source_url: 'https://academic.oup.com/jcem',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'Vaginal & Gut Microbiome: Probiotics and Natural Defense',
    slug: 'vaginal-gut-microbiome-probiotics',
    summary: 'How Lactobacillus crispatus and gut flora protect against recurrent infections.',
    content: 'A healthy vaginal microbiome is dominated by Lactobacillus species (especially L. crispatus and L. rhamnosus), which produce lactic acid to maintain a protective acidic pH (3.8-4.5) that inhibits pathogenic bacteria and yeasts. Harsh soaps, internal douching, and antibiotic overuse disrupt this flora. Fermented foods (kefir, yogurt, kimchi) and oral/vaginal probiotics support flora replenishment.',
    category: 'prevention',
    topics: ['probiotics', 'microbiome', 'lactobacillus', 'vaginal flora', 'discharge', 'hygiene', 'ph balance', 'yeast'],
    target_experience: 'women',
    tags: ['Microbiome', 'Probiotics', 'Vaginal Health', 'Hygiene', 'pH'],
    read_time_minutes: 5,
    source: 'International Society for the Study of Vulvovaginal Disease (ISSVD)',
    source_url: 'https://www.issvd.org',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'Nutritional Strategies for Urinary and Hormonal Health',
    slug: 'nutritional-strategies-urinary-hormonal-health',
    summary: 'How targeted dietary habits, hydration, and anti-inflammatory foods protect bladder health.',
    content: 'Consistent hydration (2-2.5L daily) flushes urinary pathogens. Anti-inflammatory foods (berries, leafy greens, zinc, magnesium) support hormone synthesis and cellular recovery. Limit bladder irritants (excess caffeine, alcohol, artificial sweeteners, spicy foods) during active urinary irritation.',
    category: 'nutrition',
    topics: ['hydration', 'diet', 'probiotics', 'cranberry', 'water', 'inflammation', 'coffee', 'caffeine'],
    target_experience: 'both',
    tags: ['Nutrition', 'Hydration', 'Microbiome', 'Bladder Health'],
    read_time_minutes: 4,
    source: 'Academy of Nutrition and Dietetics',
    source_url: 'https://www.eatright.org',
    version: '1.0.0',
    is_active: true,
  },
  {
    title: 'Urinary Health Prevention & Clinical Red Flags',
    slug: 'urinary-health-prevention-clinical-red-flags',
    summary: 'Actionable preventative measures and clear guidance on when to seek urgent medical care.',
    content: 'Key prevention: voiding regularly without retention, even hydration, gentle fragrance-free hygiene, and breathable clothing. Immediate medical evaluation is critical if experiencing fever (>38.5C / 101.3F), back or flank pain, nausea/vomiting, blood in urine, or symptoms persisting past 48 hours.',
    category: 'prevention',
    topics: ['fever', 'back pain', 'flank pain', 'blood in urine', 'red flags', 'emergency', 'urgent care'],
    target_experience: 'both',
    tags: ['Prevention', 'Red Flags', 'Emergency Care', 'Safety'],
    read_time_minutes: 4,
    source: 'Centers for Disease Control and Prevention (CDC)',
    source_url: 'https://www.cdc.gov',
    version: '1.0.0',
    is_active: true,
  },
]

/**
 * Score relevance of an article against search query terms and user topics
 */
function calculateRelevanceScore(
  article: { title: string; summary: string; content: string; topics: string[]; tags: string[] },
  queryTerms: string[],
  userTopics: string[] = []
): number {
  let score = 0
  const combinedText = `${article.title} ${article.summary} ${article.content}`.toLowerCase()
  const topicsJoined = article.topics.join(' ').toLowerCase()
  const tagsJoined = article.tags.join(' ').toLowerCase()

  // Match search terms
  for (const term of queryTerms) {
    if (!term || term.length < 2) continue
    const regex = new RegExp(`\\b${term}\\b`, 'i')
    if (regex.test(article.title)) score += 8
    if (regex.test(topicsJoined)) score += 6
    if (regex.test(tagsJoined)) score += 5
    if (regex.test(article.summary)) score += 4
    if (regex.test(combinedText)) score += 2
  }

  // Boost based on user profile topics/symptoms
  for (const ut of userTopics) {
    if (!ut) continue
    const regex = new RegExp(`\\b${ut}\\b`, 'i')
    if (regex.test(topicsJoined) || regex.test(tagsJoined)) score += 5
    if (regex.test(combinedText)) score += 2
  }

  return score
}

/**
 * Retrieve relevant educational context from health articles for RAG
 */
export async function retrieveRAGContext(params: {
  query: string
  userExperience: 'woman' | 'man'
  userSymptoms?: string[]
  limit?: number
}): Promise<{ results: RAGSearchResult[]; contextString: string }> {
  const { query, userExperience, userSymptoms = [], limit = 3 } = params
  const targetExp: TargetExperience = userExperience === 'woman' ? 'women' : 'boys'

  // Extract alphanumeric tokens
  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)

  let articles: RAGSearchResult[] = []

  try {
    // 1. Try querying Supabase health_articles table
    const { data: dbArticles, error } = await supabaseAdmin
      .from('health_articles')
      .select('id, title, summary, content, category, topics, target_experience, tags')
      .eq('is_active', true)
      .or(`target_experience.eq.${targetExp},target_experience.eq.both`)

    if (!error && dbArticles && dbArticles.length > 0) {
      articles = dbArticles.map((a) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        content: a.content,
        category: a.category as ArticleCategory,
        topics: a.topics || [],
        target_experience: a.target_experience as TargetExperience,
        relevanceScore: calculateRelevanceScore(a, queryTerms, userSymptoms),
      }))
    }
  } catch (err) {
    console.warn('[RAG] Supabase article query failed, falling back to embedded knowledge base:', err)
  }

  // 2. Fallback to memory knowledge base if DB empty
  if (articles.length === 0) {
    articles = FALLBACK_KNOWLEDGE_BASE
      .filter((a) => a.target_experience === targetExp || a.target_experience === 'both')
      .map((a, idx) => ({
        id: `fb-${idx}`,
        title: a.title,
        summary: a.summary,
        content: a.content,
        category: a.category,
        topics: a.topics,
        target_experience: a.target_experience,
        relevanceScore: calculateRelevanceScore(a, queryTerms, userSymptoms),
      }))
  }

  // Sort by score descending and take top N
  const ranked = articles
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, limit)

  // Format compact citation context block for AI prompt
  const contextSnippets = ranked
    .filter((r) => (r.relevanceScore || 0) > 0)
    .map(
      (r, idx) =>
        `[Document ${idx + 1}: "${r.title}" (Category: ${r.category})]\n${r.summary}\nKey Points: ${r.content.slice(0, 450)}...`
    )

  const contextString =
    contextSnippets.length > 0
      ? `\n\n[RETRIEVED TRUSTED HEALTH KNOWLEDGE (RAG)]\n${contextSnippets.join('\n\n')}\n(Use this trusted information to provide nuanced, scientifically accurate educational depth.)`
      : ''

  return {
    results: ranked,
    contextString,
  }
}
