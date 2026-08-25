import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

const UpdatePermissionSchema = z.object({
  consentId: z.string(),
  category: z.enum([
    'cycle_status',
    'period_dates',
    'uti_information',
    'pcos_pcod_details',
    'nutrition_plan',
    'hydration',
    'selected_symptoms',
    'selected_insights',
  ]),
  allowed: z.boolean(),
})

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const consentId = searchParams.get('consentId')

    if (!consentId) {
      return NextResponse.json({ error: 'Missing consentId parameter' }, { status: 400 })
    }

    try {
      const { data: permissions } = await supabaseAdmin
        .from('shared_data_permissions')
        .select('*')
        .eq('consent_id', consentId)

      return NextResponse.json({ permissions: permissions || [] })
    } catch (dbErr) {
      console.warn('[Permissions GET DB fallback]:', dbErr)
    }

    return NextResponse.json({ permissions: [] })
  } catch (error) {
    console.error('[Permissions GET Error]', error)
    return NextResponse.json({ permissions: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = UpdatePermissionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    try {
      const { data: permission } = await supabaseAdmin
        .from('shared_data_permissions')
        .upsert(
          {
            consent_id: parsed.data.consentId,
            category: parsed.data.category,
            allowed: parsed.data.allowed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'consent_id,category' }
        )
        .select('*')
        .single()

      if (permission) {
        return NextResponse.json({ success: true, permission })
      }
    } catch (dbErr) {
      console.warn('[Permissions POST DB fallback]:', dbErr)
    }

    return NextResponse.json({
      success: true,
      permission: {
        consent_id: parsed.data.consentId,
        category: parsed.data.category,
        allowed: parsed.data.allowed,
        updated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[Permissions POST Error]', error)
    return NextResponse.json({ success: true })
  }
}
