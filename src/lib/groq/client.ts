import Groq from 'groq-sdk'

// Server-only Groq client
// This file must NEVER be imported from client components
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Current supported models on Groq
export const GROQ_MODEL = 'openai/gpt-oss-120b'
export const GROQ_FALLBACK_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.6-27b']

export default groq
