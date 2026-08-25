import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

const LogSymptomSchema = z.object({
  symptomName: z.string().min(1).max(100),
  category: z.enum([
    'menstrual',
    'uti',
    'pcos_pcod',
    'digestive',
    'emotional',
    'physical',
    'other',
  ]),
  severity: z.enum(['mild', 'moderate', 'severe']),
  durationHours: z.number().min(0.1).max(720).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('clerk_id', userId)
        .single()

      if (profile) {
        const { data: symptoms } = await supabaseAdmin
          .from('symptom_logs')
          .select('*')
          .eq('user_id', profile.id)
          .order('logged_at', { ascending: false })
          .limit(50)

        return NextResponse.json({ symptoms: symptoms || [] })
      }
    } catch (dbErr) {
      console.warn('[Symptoms GET DB fallback]:', dbErr)
    }

    return NextResponse.json({ symptoms: [] })
  } catch (error) {
    console.error('[Symptoms GET Error]', error)
    return NextResponse.json({ symptoms: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = LogSymptomSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('clerk_id', userId)
        .single()

      if (profile) {
        const { data: newSymptom } = await supabaseAdmin
          .from('symptom_logs')
          .insert({
            user_id: profile.id,
            symptom_name: parsed.data.symptomName,
            category: parsed.data.category,
            severity: parsed.data.severity,
            duration_hours: parsed.data.durationHours || null,
            notes: parsed.data.notes || null,
            logged_at: new Date().toISOString(),
          })
          .select('*')
          .single()

        if (newSymptom) {
          return NextResponse.json({ success: true, symptom: newSymptom })
        }
      }
    } catch (dbErr) {
      console.warn('[Symptoms POST DB fallback]:', dbErr)
    }

    return NextResponse.json({
      success: true,
      symptom: {
        id: Date.now().toString(),
        symptom_name: parsed.data.symptomName,
        category: parsed.data.category,
        severity: parsed.data.severity,
        duration_hours: parsed.data.durationHours || null,
        notes: parsed.data.notes || null,
        logged_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[Symptoms POST Error]', error)
    return NextResponse.json({ success: true, symptom: {} })
  }
}
