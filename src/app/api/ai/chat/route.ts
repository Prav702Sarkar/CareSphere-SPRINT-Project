import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import groq, { GROQ_MODEL, GROQ_FALLBACK_MODELS } from '@/lib/groq/client'
import { WOMAN_SYSTEM_PROMPT } from '@/lib/ai/prompts/womanSystemPrompt'
import { MAN_SYSTEM_PROMPT } from '@/lib/ai/prompts/manSystemPrompt'
import {
  validateAIResponse,
  checkEscalationNeeded,
  EMERGENCY_RESPONSE,
} from '@/lib/ai/safetyValidator'
import { retrieveRAGContext } from '@/lib/ai/ragService'
import { z } from 'zod'

const RequestSchema = z.object({
  message: z.string().min(1).max(2000),
  userType: z.enum(['woman', 'man']),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).max(20).optional().default([]),
  // Minimal personalization context — only what's needed
  context: z.object({
    cyclePhase: z.string().optional(),
    recentSymptoms: z.array(z.string()).optional(),
    hydrationStatus: z.string().optional(),
    dietaryPreference: z.string().optional(),
    healthConcerns: z.array(z.string()).optional(),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse + validate request
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }

    const { message, userType, conversationHistory, context } = parsed.data

    // Check for emergency escalation needs BEFORE calling AI
    if (checkEscalationNeeded(message)) {
      return NextResponse.json({
        response: EMERGENCY_RESPONSE,
        isEmergency: true,
      })
    }

    // Build system prompt based on user type
    const systemPrompt = userType === 'woman' ? WOMAN_SYSTEM_PROMPT : MAN_SYSTEM_PROMPT

    // RAG Semantic Retrieval: Search trusted health articles for relevant knowledge
    const { contextString: ragContextString } = await retrieveRAGContext({
      query: message,
      userExperience: userType,
      userSymptoms: context?.recentSymptoms,
      limit: 3,
    })

    // Build context string (only minimal authorized info + retrieved RAG knowledge)
    let contextString = ''
    if (context) {
      const parts = []
      if (context.cyclePhase) parts.push(`User's estimated cycle phase: ${context.cyclePhase}`)
      if (context.recentSymptoms?.length) parts.push(`Recently logged symptoms: ${context.recentSymptoms.join(', ')}`)
      if (context.hydrationStatus) parts.push(`Hydration status: ${context.hydrationStatus}`)
      if (context.dietaryPreference) parts.push(`Dietary preference: ${context.dietaryPreference}`)
      if (context.healthConcerns?.length) parts.push(`Noted health concerns: ${context.healthConcerns.join(', ')}`)
      if (parts.length > 0) {
        contextString = `\n\n[USER CONTEXT — for personalization only]\n${parts.join('\n')}`
      }
    }

    // Append RAG knowledge
    contextString += ragContextString

    // Build messages array
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt + contextString },
      // Include conversation history (limited to last 10 messages)
      ...conversationHistory.slice(-10).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    let rawResponse = ''
    const candidateModels = [GROQ_MODEL, ...GROQ_FALLBACK_MODELS]

    for (const modelName of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages,
          max_tokens: 1000,
          temperature: 0.5,
          top_p: 0.9,
        })
        rawResponse = completion.choices[0]?.message?.content ?? ''
        // Strip reasoning tags if present
        rawResponse = rawResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
        if (rawResponse) break
      } catch (callErr) {
        console.warn(`[Groq model ${modelName} error, trying next fallback]:`, callErr)
      }
    }

    if (!rawResponse) {
      rawResponse = userType === 'woman'
        ? "I am here to support your health journey with evidence-based wellness education. Please feel free to ask about menstrual cycles, hydration, PCOS awareness, or UTI prevention. Remember to consult a doctor for diagnosis or prescriptions."
        : "I am here to help you understand UTI symptoms, prevention, and male urinary wellness. Please ask any questions you have, and consult a healthcare professional for persistent pain or medical evaluation."
    }

    // Safety validation
    const { sanitizedContent, safe, flags } = validateAIResponse(rawResponse)

    return NextResponse.json({
      response: sanitizedContent,
      safe,
      ...(process.env.NODE_ENV === 'development' && flags.length > 0 ? { debugFlags: flags } : {}),
    })
  } catch (error) {
    console.error('[AI Chat API Error]', error)
    return NextResponse.json({
      response: "I'm your CareSphere Health Education Assistant. I provide health and wellness education — not medical diagnoses or prescriptions. How can I help you today?",
      safe: true,
    })
  }
}

// Rate limiting header config
export const runtime = 'nodejs'
