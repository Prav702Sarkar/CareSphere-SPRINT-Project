import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { z } from 'zod'

const UpdateStatusSchema = z.object({
  requestId: z.string(),
  status: z.enum(['approved', 'rejected', 'revoked']),
  permissions: z.array(z.string()).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      let { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, email, name, role, connection_code')
        .eq('clerk_id', userId)
        .maybeSingle()

      if (!profile) {
        const user = await currentUser().catch(() => null)
        const email = user?.emailAddresses[0]?.emailAddress || ''
        const { data: profileByEmail } = await supabaseAdmin
          .from('profiles')
          .select('id, email, name, role, connection_code')
          .eq('email', email)
          .maybeSingle()

        profile = profileByEmail
      }

      if (profile) {
        // 1. Incoming requests from partner_connections where user is the Sharer
        const { data: pendingConnections } = await supabaseAdmin
          .from('partner_connections')
          .select(`
            id,
            sharer_id,
            viewer_id,
            relationship,
            status,
            permissions,
            created_at,
            viewer:profiles!partner_connections_viewer_id_fkey (
              id,
              name,
              email,
              role,
              connection_code
            )
          `)
          .eq('sharer_id', profile.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })

        // 2. Active approved connections where user is the Sharer
        const { data: activeConnections } = await supabaseAdmin
          .from('partner_connections')
          .select(`
            id,
            sharer_id,
            viewer_id,
            relationship,
            status,
            permissions,
            created_at,
            viewer:profiles!partner_connections_viewer_id_fkey (
              id,
              name,
              email,
              role,
              connection_code
            )
          `)
          .eq('sharer_id', profile.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })

        // Format for frontend
        const incoming = (pendingConnections || []).map((conn: any) => ({
          id: conn.id,
          requesterId: conn.viewer_id,
          requesterName: conn.viewer?.name || conn.viewer?.email?.split('@')[0] || 'Partner',
          requesterEmail: conn.viewer?.email || '',
          relationship: conn.relationship || 'partner',
          permissions: conn.permissions || ['cycle_status', 'hydration'],
          createdAt: conn.created_at,
        }))

        const connections = (activeConnections || []).map((conn: any) => ({
          id: conn.id,
          partnerId: conn.viewer_id,
          name: conn.viewer?.name || conn.viewer?.email?.split('@')[0] || 'Partner',
          email: conn.viewer?.email || '',
          relationship: conn.relationship || 'partner',
          status: 'approved',
          permissions: conn.permissions || ['cycle_status', 'hydration'],
          createdAt: conn.created_at,
        }))

        return NextResponse.json({
          success: true,
          incoming,
          connections,
          connectionCode: profile.connection_code,
        })
      }
    } catch (dbErr) {
      console.warn('[Partner Request GET fallback]:', dbErr)
    }

    return NextResponse.json({
      incoming: [],
      connections: [],
      connectionCode: null,
    })
  } catch (error) {
    console.error('[Partner Request GET Error]', error)
    return NextResponse.json({ incoming: [], connections: [] })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = UpdateStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    try {
      // Find current user's profile ID
      const { data: userProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('clerk_id', userId)
        .maybeSingle()

      const currentProfileId = userProfile?.id

      if (parsed.data.status === 'revoked' || parsed.data.status === 'rejected') {
        // If disconnecting / revoking, delete or mark revoked in DB
        // Can match by connection id, or where user is viewer or sharer
        if (parsed.data.requestId && parsed.data.requestId !== 'disconnect') {
          await supabaseAdmin
            .from('partner_connections')
            .delete()
            .or(`id.eq.${parsed.data.requestId},viewer_id.eq.${parsed.data.requestId},sharer_id.eq.${parsed.data.requestId}`)

          await supabaseAdmin
            .from('loved_ones')
            .delete()
            .or(`id.eq.${parsed.data.requestId},partner_user_id.eq.${parsed.data.requestId}`)
        } else if (currentProfileId) {
          // Disconnect all for this user
          await supabaseAdmin
            .from('partner_connections')
            .delete()
            .or(`viewer_id.eq.${currentProfileId},sharer_id.eq.${currentProfileId}`)

          await supabaseAdmin
            .from('loved_ones')
            .delete()
            .or(`user_id.eq.${currentProfileId},partner_user_id.eq.${currentProfileId}`)
        }

        return NextResponse.json({ success: true, status: 'revoked' })
      }

      // If updating permissions or approving
      const updatePayload: any = {
        status: parsed.data.status,
        updated_at: new Date().toISOString(),
      }

      if (parsed.data.permissions && parsed.data.permissions.length > 0) {
        updatePayload.permissions = parsed.data.permissions
      }

      // Try updating by connection ID
      let { data: updated } = await supabaseAdmin
        .from('partner_connections')
        .update(updatePayload)
        .eq('id', parsed.data.requestId)
        .select('*')
        .maybeSingle()

      // If not found by connection ID, update by viewer_id
      if (!updated) {
        const { data: updatedByViewer } = await supabaseAdmin
          .from('partner_connections')
          .update(updatePayload)
          .eq('viewer_id', parsed.data.requestId)
          .select('*')
          .maybeSingle()

        updated = updatedByViewer
      }

      return NextResponse.json({ success: true, connection: updated })
    } catch (dbErr) {
      console.warn('[Partner Request PATCH fallback]:', dbErr)
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('[Partner Request PATCH Error]', error)
    return NextResponse.json({ success: true })
  }
}
