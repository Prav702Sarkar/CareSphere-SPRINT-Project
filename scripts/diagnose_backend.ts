import * as fs from 'fs'
import * as path from 'path'

// Load .env.local manually for standalone node script execution
const envPath = path.resolve(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=')
      process.env[key.trim()] = values.join('=').trim()
    }
  })
}

import { validateAIResponse, checkEscalationNeeded, EMERGENCY_RESPONSE } from '../src/lib/ai/safetyValidator'
import { retrieveRAGContext } from '../src/lib/ai/ragService'
import { generateInsightsFromLogs } from '../src/lib/insights/generator'
import { getPersonalizedArticleRecommendations } from '../src/lib/articles/recommendationEngine'
import * as bcrypt from 'bcryptjs'

async function runDiagnostics() {
  console.log('====================================================')
  console.log('🩺 HERWELL BACKEND WORKFLOW DIAGNOSTIC SUITE')
  console.log('====================================================\n')

  let passed = 0
  let failed = 0

  function assert(testName: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`)
      passed++
    } else {
      console.error(`❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`)
      failed++
    }
  }

  // ----------------------------------------------------
  // TEST 1: AI Safety Validator & Prescription Blocking
  // ----------------------------------------------------
  console.log('--- 1. Testing AI Safety Layer ---')
  const unsafeResponse = 'You definitely have a severe infection. Take 500mg of Amoxicillin twice daily.'
  const safeCheck = validateAIResponse(unsafeResponse)
  assert('AI Safety detects prohibited antibiotics (Amoxicillin)', !safeCheck.safe)
  assert(
    'AI Safety replaces unsafe response with non-diagnostic fallback',
    !safeCheck.sanitizedContent.toLowerCase().includes('amoxicillin')
  )

  const normalResponse = 'Urinary tract symptoms can be caused by bacterial proliferation in the urethra. Staying hydrated supports bladder flushing.'
  const normalCheck = validateAIResponse(normalResponse)
  assert('AI Safety allows safe educational response', normalCheck.safe)

  // ----------------------------------------------------
  // TEST 2: Emergency Symptom Escalation Detection
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Emergency Escalation ---')
  const emergencyQuery1 = 'I have a high fever of 104 with terrible flank pain and chills'
  const isEmergency1 = checkEscalationNeeded(emergencyQuery1)
  assert('Escalation detects high fever and flank pain (possible kidney infection)', isEmergency1)

  const emergencyQuery2 = 'I see visible blood in urine when I urinate'
  const isEmergency2 = checkEscalationNeeded(emergencyQuery2)
  assert('Escalation detects hematuria (blood in urine)', isEmergency2)

  const mildQuery = 'How much water should I drink in the follicular phase?'
  const isMild = checkEscalationNeeded(mildQuery)
  assert('Escalation ignores routine wellness questions', !isMild)

  // ----------------------------------------------------
  // TEST 3: RAG Retrieval Engine
  // ----------------------------------------------------
  console.log('\n--- 3. Testing RAG Knowledge Retrieval ---')
  const ragWomen = await retrieveRAGContext({
    query: 'What causes burning sensation during urination in women?',
    userExperience: 'woman',
    userSymptoms: ['burning', 'frequency'],
    limit: 2,
  })
  assert('RAG retrieves relevant articles for women UTI query', ragWomen.results.length > 0)
  assert('RAG context string contains structured knowledge excerpts', ragWomen.contextString.includes('RETRIEVED TRUSTED HEALTH KNOWLEDGE'))

  const ragBoys = await retrieveRAGContext({
    query: 'Can boys get UTIs and what are the symptoms?',
    userExperience: 'man',
    limit: 2,
  })
  assert('RAG retrieves relevant articles for boys UTI query', ragBoys.results.length > 0)
  assert('RAG returns male-targeted educational topics', ragBoys.results.some((r) => r.category === 'boys_uti_education' || r.target_experience === 'boys'))

  // ----------------------------------------------------
  // TEST 4: Insights Rules Engine
  // ----------------------------------------------------
  console.log('\n--- 4. Testing Health Insights Engine ---')
  const mockSymptoms: any[] = [
    { id: '1', user_id: 'u1', symptom_name: 'Fatigue', category: 'physical', severity: 'mild', duration_hours: 2, notes: null, logged_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: '2', user_id: 'u1', symptom_name: 'Fatigue', category: 'physical', severity: 'mild', duration_hours: 2, notes: null, logged_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: '3', user_id: 'u1', symptom_name: 'Fatigue', category: 'physical', severity: 'moderate', duration_hours: 2, notes: null, logged_at: new Date().toISOString(), created_at: new Date().toISOString() },
  ]
  const mockWater: any[] = [
    { id: '1', user_id: 'u1', amount_ml: 1200, logged_at: new Date().toISOString(), created_at: new Date().toISOString() },
  ]
  const mockCycles: any[] = [
    { id: '1', user_id: 'u1', period_start: '2026-08-01', period_end: '2026-08-05', flow: 'moderate', cramps: 'mild', mood: 'good', energy: 'moderate', notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', user_id: 'u1', period_start: '2026-07-04', period_end: '2026-07-08', flow: 'moderate', cramps: 'mild', mood: 'good', energy: 'moderate', notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ]

  const insights = generateInsightsFromLogs({
    symptoms: mockSymptoms,
    cycles: mockCycles,
    waterLogs: mockWater,
    hydrationGoalMl: 2000,
  })

  assert('Insights engine detects symptom pattern for recurring Fatigue', insights.some((i) => i.title.includes('Pattern Noticed: Fatigue')))
  assert('Insights engine computes cycle interval calculation (28 days regular)', insights.some((i) => i.title.includes('Regular Cycle Interval')))
  assert('Insights engine identifies hydration support opportunity', insights.some((i) => i.type === 'hydration'))

  // ----------------------------------------------------
  // TEST 5: OTP Cryptographic Security Lifecycle
  // ----------------------------------------------------
  console.log('\n--- 5. Testing OTP Hashing & Verification Lifecycle ---')
  const testOtp = '849201'
  const hashedOtp = await bcrypt.hash(testOtp, 10)
  const isValidOtp = await bcrypt.compare(testOtp, hashedOtp)
  const isInvalidOtp = await bcrypt.compare('123456', hashedOtp)

  assert('OTP Bcrypt hash matches generated code', isValidOtp)
  assert('OTP Bcrypt rejects incorrect code', !isInvalidOtp)

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================')
  console.log(`📊 DIAGNOSTIC RESULTS: ${passed} PASSED, ${failed} FAILED`)
  console.log('====================================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runDiagnostics().catch((err) => {
  console.error('Fatal diagnostic error:', err)
  process.exit(1)
})
