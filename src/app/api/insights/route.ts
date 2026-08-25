import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateInsightsFromLogs } from '@/lib/insights/generator'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      // Get user profile
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('clerk_id', userId)
        .single()

      if (profile) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

        const [symptomsRes, cyclesRes, waterRes, healthProfileRes] = await Promise.all([
          supabaseAdmin
            .from('symptom_logs')
            .select('*')
            .eq('user_id', profile.id)
            .gte('logged_at', thirtyDaysAgo)
            .order('logged_at', { ascending: false }),
          supabaseAdmin
            .from('cycle_logs')
            .select('*')
            .eq('user_id', profile.id)
            .order('period_start', { ascending: false })
            .limit(10),
          supabaseAdmin
            .from('water_logs')
            .select('*')
            .eq('user_id', profile.id)
            .gte('logged_at', thirtyDaysAgo)
            .order('logged_at', { ascending: false }),
          supabaseAdmin
            .from('health_profiles')
            .select('hydration_goal_ml')
            .eq('user_id', profile.id)
            .single(),
        ])

        const generatedInsights = generateInsightsFromLogs({
          symptoms: symptomsRes?.data || [],
          cycles: cyclesRes?.data || [],
          waterLogs: waterRes?.data || [],
          hydrationGoalMl: healthProfileRes?.data?.hydration_goal_ml || 2000,
        })

        return NextResponse.json({
          insights: generatedInsights,
          stats: {
            totalSymptomsLogged: symptomsRes?.data?.length || 0,
            totalWaterLogs: waterRes?.data?.length || 0,
            totalCyclesRecorded: cyclesRes?.data?.length || 0,
          },
        })
      }
    } catch (dbErr) {
      console.warn('[Insights DB fallback]:', dbErr)
    }

    // Default safe response so UI renders smoothly
    const defaultInsights = generateInsightsFromLogs({
      symptoms: [],
      cycles: [],
      waterLogs: [],
      hydrationGoalMl: 2000,
    })

    return NextResponse.json({
      insights: defaultInsights,
      stats: {
        totalSymptomsLogged: 0,
        totalWaterLogs: 0,
        totalCyclesRecorded: 0,
      },
    })
  } catch (error) {
    console.error('[Insights API Error]', error)
    return NextResponse.json({
      insights: [],
      stats: { totalSymptomsLogged: 0, totalWaterLogs: 0, totalCyclesRecorded: 0 },
    })
  }
}
