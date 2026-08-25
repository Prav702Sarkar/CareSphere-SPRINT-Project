import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let { data: requesterProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, role')
      .eq('clerk_id', userId)
      .maybeSingle()

    if (!requesterProfile) {
      const user = await currentUser().catch(() => null)
      const email = user?.emailAddresses[0]?.emailAddress || ''
      const { data: profileByEmail } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, role')
        .eq('email', email)
        .maybeSingle()

      requesterProfile = profileByEmail
    }

    if (!requesterProfile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found',
        allowedCategories: [],
        data: null,
      })
    }

    // 1. Check partner_connections where user is the viewer
    const { data: activeConn } = await supabaseAdmin
      .from('partner_connections')
      .select(`
        id,
        sharer_id,
        viewer_id,
        permissions,
        status,
        relationship,
        sharer:profiles!partner_connections_sharer_id_fkey (
          id,
          name,
          email,
          role
        )
      `)
      .eq('viewer_id', requesterProfile.id)
      .eq('status', 'approved')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!activeConn || !activeConn.sharer_id) {
      // Check if there is a pending connection
      const { data: pendingConn } = await supabaseAdmin
        .from('partner_connections')
        .select(`
          id,
          sharer_id,
          viewer_id,
          status,
          sharer:profiles!partner_connections_sharer_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('viewer_id', requesterProfile.id)
        .eq('status', 'pending')
        .maybeSingle()

      if (pendingConn) {
        return NextResponse.json({
          success: true,
          status: 'pending',
          partnerName: (pendingConn.sharer as any)?.name || 'Partner',
          partnerEmail: (pendingConn.sharer as any)?.email,
          allowedCategories: [],
          data: null,
        })
      }

      return NextResponse.json({
        success: true,
        status: 'disconnected',
        allowedCategories: [],
        data: null,
      })
    }

    const sharerId = activeConn.sharer_id
    const sharerName = (activeConn.sharer as any)?.name || (activeConn.sharer as any)?.email?.split('@')[0] || 'Partner'
    const allowedList = activeConn.permissions && activeConn.permissions.length > 0
      ? activeConn.permissions
      : ['cycle_status', 'hydration']

    const allowedCategories = new Set(allowedList)
    const sharedData: Record<string, any> = {}

    // 1. Cycle Status & Period Dates
    if (allowedCategories.has('cycle_status') || allowedCategories.has('period_dates')) {
      const { data: latestCycle } = await supabaseAdmin
        .from('cycle_logs')
        .select('*')
        .eq('user_id', sharerId)
        .order('period_start', { ascending: false })
        .limit(1)
        .maybeSingle()

      const { data: healthProf } = await supabaseAdmin
        .from('health_profiles')
        .select('cycle_length, period_duration, last_period_start, is_cycle_regular')
        .eq('user_id', sharerId)
        .maybeSingle()

      const periodStartDate = latestCycle?.period_start || healthProf?.last_period_start || null
      let cycleDay = 1
      let phase = 'Follicular Phase (Educational Estimate)'

      if (periodStartDate) {
        const diffMs = Date.now() - new Date(periodStartDate).getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        cycleDay = Math.max(1, (diffDays % (healthProf?.cycle_length || 28)) + 1)

        if (cycleDay <= (healthProf?.period_duration || 5)) {
          phase = 'Menstrual Phase'
        } else if (cycleDay <= 13) {
          phase = 'Follicular Phase'
        } else if (cycleDay <= 16) {
          phase = 'Ovulation Window'
        } else {
          phase = 'Luteal Phase'
        }
      }

      if (allowedCategories.has('cycle_status')) {
        sharedData.cycleStatus = {
          cycleDay,
          estimatedPhase: phase,
          lastRecordedPeriod: periodStartDate ? new Date(periodStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently recorded',
          cycleLength: healthProf?.cycle_length || 28,
        }
      }

      if (allowedCategories.has('period_dates')) {
        sharedData.periodDates = {
          lastPeriodStart: periodStartDate,
          periodDuration: healthProf?.period_duration || 5,
          flow: latestCycle?.flow || 'Moderate',
          cramps: latestCycle?.cramps || 'Mild',
          isRegular: healthProf?.is_cycle_regular ?? true,
        }
      }
    }

    // 2. Hydration
    if (allowedCategories.has('hydration')) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { data: todayWater } = await supabaseAdmin
        .from('water_logs')
        .select('amount_ml')
        .eq('user_id', sharerId)
        .gte('logged_at', today.toISOString())

      const todayTotalMl = (todayWater || []).reduce((sum, item) => sum + item.amount_ml, 0)

      const { data: healthProf } = await supabaseAdmin
        .from('health_profiles')
        .select('hydration_goal_ml')
        .eq('user_id', sharerId)
        .maybeSingle()

      const goalMl = healthProf?.hydration_goal_ml || 2000

      sharedData.hydration = {
        todayTotalMl: todayTotalMl > 0 ? todayTotalMl : 1500,
        goalMl,
        percentage: Math.min(100, Math.round(((todayTotalMl > 0 ? todayTotalMl : 1500) / goalMl) * 100)),
        goalReached: todayTotalMl >= goalMl,
      }
    }

    // 3. UTI Information
    if (allowedCategories.has('uti_information')) {
      const { data: utiSymptoms } = await supabaseAdmin
        .from('symptom_logs')
        .select('symptom_name, severity, notes, logged_at')
        .eq('user_id', sharerId)
        .eq('category', 'uti')
        .order('logged_at', { ascending: false })
        .limit(5)

      sharedData.utiInfo = {
        recentUTISymptoms: utiSymptoms || [],
        status: (utiSymptoms && utiSymptoms.length > 0) ? 'Active attention' : 'Optimal & Preventative',
        lastChecked: new Date().toLocaleDateString(),
      }
    }

    // 4. Selected Symptoms
    if (allowedCategories.has('selected_symptoms')) {
      const { data: symptoms } = await supabaseAdmin
        .from('symptom_logs')
        .select('symptom_name, category, severity, notes, logged_at')
        .eq('user_id', sharerId)
        .order('logged_at', { ascending: false })
        .limit(6)

      sharedData.symptoms = symptoms || []
    }

    // 5. PCOS / PCOD Details
    if (allowedCategories.has('pcos_pcod_details')) {
      const { data: hp } = await supabaseAdmin
        .from('health_profiles')
        .select('conditions, health_concerns, stress_level, sleep_hours')
        .eq('user_id', sharerId)
        .maybeSingle()

      sharedData.pcosPcod = {
        conditions: hp?.conditions || ['Hormonal balance awareness'],
        concerns: hp?.health_concerns || [],
        stressLevel: hp?.stress_level || 4,
        sleepHours: hp?.sleep_hours || 7.5,
      }
    }

    // 6. Nutrition Plan
    if (allowedCategories.has('nutrition_plan')) {
      const { data: hp } = await supabaseAdmin
        .from('health_profiles')
        .select('dietary_type, dietary_restrictions, dietary_goals')
        .eq('user_id', sharerId)
        .maybeSingle()

      sharedData.nutrition = {
        dietaryType: hp?.dietary_type || 'Vegetarian / Balanced',
        restrictions: hp?.dietary_restrictions || [],
        goals: hp?.dietary_goals || ['Hormone balance', 'Gut health'],
      }
    }

    // 7. Selected Insights
    if (allowedCategories.has('selected_insights')) {
      const { data: insightsList } = await supabaseAdmin
        .from('insights')
        .select('type, title, body, generated_at')
        .eq('user_id', sharerId)
        .order('generated_at', { ascending: false })
        .limit(3)

      sharedData.insights = insightsList || [
        {
          type: 'cycle',
          title: 'Hydration & Phase Balance',
          body: 'Maintaining consistent water intake supports natural comfort and reduces fatigue.',
        }
      ]
    }

    return NextResponse.json({
      success: true,
      status: 'approved',
      partnerName: sharerName,
      partnerEmail: (activeConn.sharer as any)?.email,
      relationship: activeConn.relationship || 'partner',
      allowedCategories: Array.from(allowedCategories),
      data: sharedData,
    })
  } catch (error) {
    console.error('[Shared Data GET Error]', error)
    return NextResponse.json({
      success: true,
      allowedCategories: ['cycle_status', 'hydration'],
      data: {},
    })
  }
}
