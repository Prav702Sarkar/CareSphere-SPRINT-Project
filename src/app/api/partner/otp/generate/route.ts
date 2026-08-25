import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/service'
import * as bcrypt from 'bcryptjs'
import { z } from 'zod'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const GenerateSchema = z.object({
  partnerRequestId: z.string().uuid(),
  targetEmail: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = GenerateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Get the user's profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('clerk_id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Rate limiting: max 3 OTPs per user per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabaseAdmin
      .from('otp_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('purpose', 'partner_access')
      .gte('created_at', oneHourAgo)

    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait before requesting again.' },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const hashedOtp = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    // Store hashed OTP
    const { data: otpRecord, error: insertError } = await supabaseAdmin
      .from('otp_verifications')
      .insert({
        user_id: profile.id,
        purpose: 'partner_access',
        hashed_otp: hashedOtp,
        expires_at: expiresAt,
      })
      .select('id')
      .single()

    if (insertError || !otpRecord) {
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 })
    }

    // Send OTP via unified email service (Gmail SMTP / Resend fallback)
    await sendEmail({
      to: parsed.data.targetEmail,
      subject: 'CareSphere — Partner Access Verification Code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #f3f4f6; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #c026d3; margin-top: 0;">CareSphere Partner Verification</h2>
          <p style="color: #374151; font-size: 14px;">Your partner has requested access to view health information with you on CareSphere.</p>
          <p style="color: #374151; font-size: 14px;">Use the following 6-digit verification code to complete the connection:</p>
          <div style="background: #fdf4ff; border: 1px solid #f0abfc; padding: 16px; text-align: center; border-radius: 12px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #86198f;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px;">This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 11px; margin-bottom: 0;">CareSphere · Health Education Platform · Not a medical service</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to email',
      otpId: otpRecord.id,
      expiresAt,
    })
  } catch (error) {
    console.error('[OTP Generate Error]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
