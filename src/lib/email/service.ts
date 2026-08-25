import nodemailer from 'nodemailer'
import { Resend } from 'resend'

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

interface SendEmailResult {
  success: boolean
  provider: 'gmail' | 'resend' | 'mock'
  id?: string
  error?: string
}

let gmailTransporter: nodemailer.Transporter | null = null

function getGmailTransporter(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_USER?.trim()
  const pass = process.env.GMAIL_APP_PASSWORD?.trim().replace(/\s+/g, '')

  if (!user || !pass) return null

  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    })
  }

  return gmailTransporter
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailParams): Promise<SendEmailResult> {
  const recipient = Array.isArray(to) ? to.join(', ') : to

  // 1. Try Gmail SMTP with App Password
  const transporter = getGmailTransporter()
  if (transporter && process.env.GMAIL_USER) {
    try {
      const sender = from || `"CareSphere Health" <${process.env.GMAIL_USER}>`
      const info = await transporter.sendMail({
        from: sender,
        to: recipient,
        subject,
        html,
      })

      return {
        success: true,
        provider: 'gmail',
        id: info.messageId,
      }
    } catch (gmailErr: any) {
      console.warn('[Email Service] Gmail SMTP failed, attempting fallback:', gmailErr?.message)
    }
  }

  // 2. Fallback to Resend if RESEND_API_KEY is available
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const resendFrom = from || process.env.EMAIL_FROM || 'onboarding@resend.dev'
      const { data, error } = await resend.emails.send({
        from: resendFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      })

      if (!error && data) {
        return {
          success: true,
          provider: 'resend',
          id: data.id,
        }
      }
      if (error) {
        console.warn('[Email Service] Resend dispatch error:', error.message)
      }
    } catch (resendErr: any) {
      console.warn('[Email Service] Resend client failed:', resendErr?.message)
    }
  }

  // 3. Graceful Mock / Dev fallback
  console.log(`[Email Service Mock] Sent to: ${recipient} | Subject: ${subject}`)
  return {
    success: true,
    provider: 'mock',
    id: 'mock_' + Date.now(),
  }
}
