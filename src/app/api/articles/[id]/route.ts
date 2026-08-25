import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check by ID (UUID) or by slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    let query = supabaseAdmin.from('health_articles').select('*').eq('is_active', true)

    if (isUUID) {
      query = query.eq('id', id)
    } else {
      query = query.eq('slug', id)
    }

    const { data: article, error } = await query.single()

    if (error || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Fetch related articles from same category
    const { data: related } = await supabaseAdmin
      .from('health_articles')
      .select('id, title, slug, summary, read_time_minutes, category')
      .eq('category', article.category)
      .neq('id', article.id)
      .eq('is_active', true)
      .limit(3)

    return NextResponse.json({
      article,
      relatedArticles: related || [],
    })
  } catch (error) {
    console.error('[Article Detail Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
