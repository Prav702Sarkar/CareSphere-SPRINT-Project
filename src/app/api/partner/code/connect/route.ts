import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

const ConnectCodeSchema = z.object({
  code: z.string().min(3).max(20),
  relationship: z.string().optional().default('partner'),
  permissions: z.array(z.string()).optional().default(['cycle_status', 'hydration', 'uti_information']),
  message: z.string().max(500).optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = ConnectCodeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid code format', details: parsed.error.flatten() }, { status: 400 })
    }

    const inputCode = parsed.data.code.trim().toUpperCase()

    // 1. Get current user's profile
    let { data: currentUserProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, role, connection_code')
      .eq('clerk_id', userId)
      .maybeSingle()

    if (!currentUserProfile) {
      const user = await currentUser().catch(() => null)
      const email = user?.emailAddresses[0]?.emailAddress || ''
      const name = user?.firstName || 'CareSphere User'

      const { data: created } = await supabaseAdmin
        .from('profiles')
        .insert({
          clerk_id: userId,
          email,
          name,
          role: 'woman',
        })
        .select('*')
        .single()
      currentUserProfile = created
    }

    if (!currentUserProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // 2. Find target profile by connection_code
    const { data: targetProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, role, connection_code')
      .eq('connection_code', inputCode)
      .maybeSingle()

    if (!targetProfile) {
      return NextResponse.json({ error: 'Invalid or expired connection code. Please check the code with your partner.' }, { status: 404 })
    }

    // Prevent connecting to self
    if (targetProfile.id === currentUserProfile.id) {
      return NextResponse.json({ error: 'You cannot connect with your own code.' }, { status: 400 })
    }

    const isWoman = currentUserProfile.role === 'woman'

    if (isWoman) {
      // Woman entered a joiner's code -> SHE IS AUTHORIZING DIRECT ACCESS
      // Create or update approved partner_connection
      const { data: connection, error: connErr } = await supabaseAdmin
        .from('partner_connections')
        .upsert(
          {
            sharer_id: currentUserProfile.id,
            viewer_id: targetProfile.id,
            relationship: parsed.data.relationship,
            status: 'approved',
            permissions: parsed.data.permissions,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'sharer_id,viewer_id' }
        )
        .select('*')
        .single()

      // Also create loved_ones record for UI listing
      try {
        await supabaseAdmin
          .from('loved_ones')
          .upsert(
            {
              user_id: currentUserProfile.id,
              partner_user_id: targetProfile.id,
              partner_name: targetProfile.name || targetProfile.email.split('@')[0],
              partner_email: targetProfile.email,
              relationship: parsed.data.relationship,
              status: 'approved',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,partner_email' }
          )
      } catch {}

      return NextResponse.json({
        success: true,
        status: 'approved',
        partner: {
          id: targetProfile.id,
          name: targetProfile.name || targetProfile.email.split('@')[0],
          email: targetProfile.email,
          role: targetProfile.role,
          relationship: parsed.data.relationship,
          permissions: parsed.data.permissions,
        },
        message: `Successfully connected with ${targetProfile.name || 'Partner'}!`,
      })
    } else {
      // Boy / Man entered Her code -> SENDS ACCESS REQUEST TO HER DASHBOARD
      const { data: newRequest } = await supabaseAdmin
        .from('partner_requests')
        .insert({
          requester_id: currentUserProfile.id,
          requester_name: currentUserProfile.name || currentUserProfile.email.split('@')[0],
          requester_email: currentUserProfile.email,
          target_email: targetProfile.email,
          status: 'pending',
          message: parsed.data.message || `Connected via code ${inputCode}`,
        })
        .select('*')
        .single()

      // Also create pending connection in partner_connections
      try {
        await supabaseAdmin
          .from('partner_connections')
          .upsert(
            {
              sharer_id: targetProfile.id,
              viewer_id: currentUserProfile.id,
              relationship: parsed.data.relationship,
              status: 'pending',
              permissions: parsed.data.permissions,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'sharer_id,viewer_id' }
          )
      } catch {}

      return NextResponse.json({
        success: true,
        status: 'pending',
        partner: {
          id: targetProfile.id,
          name: targetProfile.name || targetProfile.email.split('@')[0],
          email: targetProfile.email,
        },
        message: `Connection request sent to ${targetProfile.name || 'Partner'}. Waiting for her to approve access on her dashboard.`,
      })
    }
  } catch (error) {
    console.error('[Connect Code API Error]', error)
    return NextResponse.json({ error: 'Server error connecting with code' }, { status: 500 })
  }
}
