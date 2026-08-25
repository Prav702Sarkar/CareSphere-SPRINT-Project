import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import * as bcrypt from 'bcryptjs'
import { z } from 'zod'

const VerifySchema = z.object({
  otpId: z.string().uuid(),
  otp: z.string().length(6).regex(/^\d+$/),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = VerifySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { otpId, otp } = parsed.data

    // Get the OTP record
    const { data: otpRecord } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('id', otpId)
      .single()

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    // Check if already used
    if (otpRecord.used_at) {
      return NextResponse.json({ error: 'This verification code has already been used' }, { status: 400 })
    }

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 })
    }

    // Check max attempts
    if (otpRecord.attempt_count >= parseInt(process.env.OTP_MAX_ATTEMPTS ?? '3')) {
      await supabaseAdmin
        .from('otp_verifications')
        .update({ used_at: new Date().toISOString() })
        .eq('id', otpId)
      return NextResponse.json({ error: 'Too many failed attempts. Please request a new code.' }, { status: 400 })
    }

    // Verify OTP (constant-time comparison via bcrypt)
    const isValid = await bcrypt.compare(otp, otpRecord.hashed_otp)

    if (!isValid) {
      // Increment attempt count
      await supabaseAdmin
        .from('otp_verifications')
        .update({ attempt_count: otpRecord.attempt_count + 1 })
        .eq('id', otpId)

      const remaining = parseInt(process.env.OTP_MAX_ATTEMPTS ?? '3') - otpRecord.attempt_count - 1
      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` },
        { status: 400 }
      )
    }

    // Mark OTP as used (single-use enforcement)
    await supabaseAdmin
      .from('otp_verifications')
      .update({ used_at: new Date().toISOString() })
      .eq('id', otpId)

    // Create partner consent record
    const { data: requesterProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (requesterProfile) {
      // Create consent record linking man and woman
      // In a real implementation, both user IDs would be available from the request context
      await supabaseAdmin
        .from('partner_consents')
        .upsert({
          woman_id: otpRecord.user_id,
          man_id: requesterProfile.id,
          verified_at: new Date().toISOString(),
          active: true,
        }, { onConflict: 'woman_id,man_id' })

      // Create default permissions (all private by default)
      const { data: consent } = await supabaseAdmin
        .from('partner_consents')
        .select('id')
        .eq('woman_id', otpRecord.user_id)
        .eq('man_id', requesterProfile.id)
        .single()

      if (consent) {
        const categories = ['cycle_status', 'period_dates', 'uti_information', 'pcos_pcod_details', 'nutrition_plan', 'hydration', 'selected_symptoms', 'selected_insights']
        await supabaseAdmin
          .from('shared_data_permissions')
          .upsert(
            categories.map((cat) => ({
              consent_id: consent.id,
              category: cat,
              allowed: false, // All private by default — woman enables explicitly
            })),
            { onConflict: 'consent_id,category' }
          )
      }
    }

    return NextResponse.json({ success: true, message: 'Partner access verified successfully' })
  } catch (error) {
    console.error('[OTP Verify Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
