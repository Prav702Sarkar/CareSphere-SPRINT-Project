import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getPersonalizedArticleRecommendations } from '@/lib/articles/recommendationEngine'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const experience = (searchParams.get('experience') || 'women') as 'women' | 'boys'
    const search = searchParams.get('search')?.toLowerCase()
    const personalized = searchParams.get('personalized') === 'true'

    const { userId } = await auth()

    // If personalized recommendation requested and user is authenticated
    if (personalized && userId) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('clerk_id', userId)
        .single()

      if (profile) {
        const userExperience = profile.role === 'man' ? 'boys' : 'women'

        // Fetch recent symptoms & health profile for personalization signals
        const [symptomsRes, healthProfileRes] = await Promise.all([
          supabaseAdmin
            .from('symptom_logs')
            .select('symptom_name')
            .eq('user_id', profile.id)
            .order('logged_at', { ascending: false })
            .limit(10),
          supabaseAdmin
            .from('health_profiles')
            .select('health_concerns, conditions')
            .eq('user_id', profile.id)
            .single(),
        ])

        const recentSymptoms = (symptomsRes.data || []).map((s) => s.symptom_name)
        const healthConcerns = [
          ...(healthProfileRes.data?.health_concerns || []),
          ...(healthProfileRes.data?.conditions || []),
        ]

        const recommended = await getPersonalizedArticleRecommendations({
          userExperience,
          symptoms: recentSymptoms,
          healthConcerns,
          limit: 8,
        })

        return NextResponse.json({
          articles: recommended,
          isPersonalized: true,
          signals: {
            symptoms: recentSymptoms,
            concerns: healthConcerns,
          },
        })
      }
    }

    // Standard filter/search query
    let query = supabaseAdmin
      .from('health_articles')
      .select('id, title, slug, summary, category, topics, target_experience, tags, read_time_minutes, source, source_url, updated_at')
      .eq('is_active', true)
      .or(`target_experience.eq.${experience},target_experience.eq.both`)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    let articles: any[] | null = null
    let error: any = null

    try {
      const res = await query.order('created_at', { ascending: false })
      articles = res.data
      error = res.error
    } catch (err) {
      error = err
    }

    let filtered = articles || []
    if (error || !articles || articles.length === 0) {
      // Graceful fallback to embedded clinical knowledge base
      filtered = [
        {
          id: '1',
          title: 'Understanding Urinary Tract Infections (UTIs) in Women',
          slug: 'understanding-utis-in-women',
          summary: 'Causes, female anatomy, early symptoms, and evidence-based self-care.',
          category: 'uti',
          topics: ['burning', 'frequency', 'cloudy urine', 'pelvic pain', 'urination', 'uti'],
          target_experience: 'women',
          tags: ['UTI', 'Urinary Health', 'Bladder', 'Hygiene'],
          read_time_minutes: 5,
          source: 'American Urological Association & WHO Guidelines',
          source_url: 'https://www.urologyhealth.org',
        },
        {
          id: '2',
          title: 'Male UTI Awareness: Symptoms, Causes, and Prevention',
          slug: 'male-uti-awareness-and-prevention',
          summary: 'Urinary tract infections in boys and men, common risk factors, and myth-busting.',
          category: 'boys_uti_education',
          topics: ['burning', 'frequency', 'difficulty urinating', 'male uti', 'cloudy urine'],
          target_experience: 'boys',
          tags: ['Male Health', 'UTI', 'Urinary Education', 'Prevention'],
          read_time_minutes: 4,
          source: 'National Institute of Diabetes and Digestive and Kidney Diseases',
          source_url: 'https://www.niddk.nih.gov',
        },
        {
          id: '3',
          title: 'PCOS & PCOD: Hormonal Pathways, Symptoms, and Lifestyle Management',
          slug: 'pcos-pcod-hormonal-pathways-and-management',
          summary: 'Understanding polycystic ovary syndrome, insulin sensitivity, and holistic lifestyle strategies.',
          category: 'pcos_pcod',
          topics: ['irregular periods', 'acne', 'facial hair', 'weight gain', 'hair loss', 'pcos', 'pcod'],
          target_experience: 'women',
          tags: ['PCOS', 'PCOD', 'Hormones', 'Insulin Resistance', 'Metabolism'],
          read_time_minutes: 6,
          source: 'Endocrine Society Clinical Practice Guidelines',
          source_url: 'https://www.endocrine.org',
        },
        {
          id: '4',
          title: 'The Four Menstrual Cycle Phases: Connecting Energy, Mood, and Physiology',
          slug: 'four-menstrual-cycle-phases',
          summary: 'Explore the physiological shifts across menstrual, follicular, ovulatory, and luteal phases.',
          category: 'menstrual_health',
          topics: ['cramps', 'mood', 'energy', 'period', 'cycle', 'ovulation', 'follicular', 'luteal'],
          target_experience: 'women',
          tags: ['Menstrual Cycle', 'Hormones', 'Ovulation', 'Wellness', 'Self-Care'],
          read_time_minutes: 5,
          source: 'American College of Obstetricians and Gynecologists (ACOG)',
          source_url: 'https://www.acog.org',
        },
        {
          id: '5',
          title: 'Nutritional Strategies for Urinary and Hormonal Health',
          slug: 'nutritional-strategies-urinary-hormonal-health',
          summary: 'How targeted dietary habits, probiotics, and hydration protect bladder health and hormonal balance.',
          category: 'nutrition',
          topics: ['hydration', 'diet', 'probiotics', 'cranberry', 'water', 'inflammation'],
          target_experience: 'both',
          tags: ['Nutrition', 'Hydration', 'Microbiome', 'Bladder Health'],
          read_time_minutes: 4,
          source: 'Academy of Nutrition and Dietetics',
          source_url: 'https://www.eatright.org',
        },
        {
          id: '6',
          title: 'Urinary Health Prevention & Clinical Red Flags',
          slug: 'urinary-health-prevention-clinical-red-flags',
          summary: 'Actionable preventative measures and clear guidance on when to seek urgent medical care.',
          category: 'prevention',
          topics: ['fever', 'back pain', 'flank pain', 'blood in urine', 'red flags', 'emergency'],
          target_experience: 'both',
          tags: ['Prevention', 'Red Flags', 'Emergency Care', 'Safety'],
          read_time_minutes: 4,
          source: 'Centers for Disease Control and Prevention (CDC)',
          source_url: 'https://www.cdc.gov',
        },
      ].filter(
        (a) =>
          (a.target_experience === experience || a.target_experience === 'both') &&
          (!category || category === 'all' || a.category === category)
      ) as any[]
    }
    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.summary.toLowerCase().includes(search) ||
          a.tags.some((t: string) => t.toLowerCase().includes(search))
      )
    }

    return NextResponse.json(
      { articles: filtered, isPersonalized: false },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('[Articles GET Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
