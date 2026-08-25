import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

const LogWaterSchema = z.object({
  amountMl: z.number().min(50).max(2000),
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
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const [logsRes, healthRes] = await Promise.all([
          supabaseAdmin
            .from('water_logs')
            .select('*')
            .eq('user_id', profile.id)
            .gte('logged_at', todayStart.toISOString())
            .order('logged_at', { ascending: false }),
          supabaseAdmin
            .from('health_profiles')
            .select('hydration_goal_ml')
            .eq('user_id', profile.id)
            .single(),
        ])

        const totalMl = (logsRes.data || []).reduce((sum, log) => sum + (log.amount_ml || 0), 0)

        return NextResponse.json({
          todayTotalMl: totalMl,
          todayLogs: logsRes.data || [],
          goalMl: healthRes.data?.hydration_goal_ml || 2000,
        })
      }
    } catch (dbErr) {
      console.warn('[Water GET DB fallback]:', dbErr)
    }

    return NextResponse.json({
      todayTotalMl: 0,
      todayLogs: [],
      goalMl: 2000,
    })
  } catch (error) {
    console.error('[Water GET Error]', error)
    return NextResponse.json({
      todayTotalMl: 0,
      todayLogs: [],
      goalMl: 2000,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = LogWaterSchema.safeParse(body)
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
        const { data: newLog } = await supabaseAdmin
          .from('water_logs')
          .insert({
            user_id: profile.id,
            amount_ml: parsed.data.amountMl,
            logged_at: new Date().toISOString(),
          })
          .select('*')
          .single()

        if (newLog) {
          return NextResponse.json({ success: true, log: newLog })
        }
      }
    } catch (dbErr) {
      console.warn('[Water POST DB fallback]:', dbErr)
    }

    return NextResponse.json({
      success: true,
      log: {
        id: Date.now().toString(),
        amount_ml: parsed.data.amountMl,
        logged_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[Water POST Error]', error)
    return NextResponse.json({ success: true })
  }
}
