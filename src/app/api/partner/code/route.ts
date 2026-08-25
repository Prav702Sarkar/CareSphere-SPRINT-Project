import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

function generateConnectionCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code = 'CARE-'
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      let { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, role, connection_code')
        .eq('clerk_id', userId)
        .maybeSingle()

      if (!profile) {
        const user = await currentUser().catch(() => null)
        const email = user?.emailAddresses[0]?.emailAddress || ''
        const name = user?.firstName || 'CareSphere User'

        const { data: newProfile } = await supabaseAdmin
          .from('profiles')
          .insert({
            clerk_id: userId,
            email,
            name,
            role: 'man',
            connection_code: generateConnectionCode(),
          })
          .select('id, name, email, role, connection_code')
          .single()

        profile = newProfile
      }

      if (profile) {
        let code = profile.connection_code
        if (!code) {
          code = generateConnectionCode()
          await supabaseAdmin
            .from('profiles')
            .update({ connection_code: code, updated_at: new Date().toISOString() })
            .eq('id', profile.id)
        }

        return NextResponse.json({
          success: true,
          code,
          name: profile.name,
          role: profile.role,
        })
      }
    } catch (dbErr) {
      console.warn('[Get Code DB error]:', dbErr)
    }

    // Dynamic fallback code
    return NextResponse.json({
      success: true,
      code: 'CARE-' + userId.slice(-4).toUpperCase(),
    })
  } catch (error) {
    console.error('[Get Code API Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const newCode = generateConnectionCode()

    try {
      await supabaseAdmin
        .from('profiles')
        .update({ connection_code: newCode, updated_at: new Date().toISOString() })
        .eq('clerk_id', userId)

      return NextResponse.json({ success: true, code: newCode })
    } catch (dbErr) {
      console.warn('[Regenerate Code DB fallback]:', dbErr)
      return NextResponse.json({ success: true, code: newCode })
    }
  } catch (error) {
    console.error('[Regenerate Code Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
