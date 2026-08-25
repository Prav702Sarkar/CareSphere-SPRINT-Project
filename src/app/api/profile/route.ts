import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      // 1. First check by clerk_id
      let { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('clerk_id', userId)
        .maybeSingle()

      // 2. If not found by clerk_id, check by email
      if (!profile) {
        const user = await currentUser().catch(() => null)
        const email = user?.emailAddresses[0]?.emailAddress
        if (email) {
          const { data: profileByEmail } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle()

          if (profileByEmail) {
            profile = profileByEmail
            // Update clerk_id in database for future queries
            try {
              await supabaseAdmin
                .from('profiles')
                .update({ clerk_id: userId, updated_at: new Date().toISOString() })
                .eq('id', profileByEmail.id)
            } catch {}
          }
        }
      }

      if (profile) {
        return NextResponse.json({
          success: true,
          profile: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            onboardingComplete: profile.onboarding_complete,
            ageGroup: profile.age_group,
            lifestyle: profile.lifestyle,
          },
        })
      }
    } catch (dbErr) {
      console.warn('[Profile GET DB error]:', dbErr)
    }

    // Default fallback if profile does not exist yet
    return NextResponse.json({
      success: true,
      profile: null,
    })
  } catch (error) {
    console.error('[Profile API Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
