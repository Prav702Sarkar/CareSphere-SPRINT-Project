// ============================================================
// AI RESPONSE SAFETY VALIDATOR
// ============================================================
// Checks AI responses for prohibited content before sending to frontend

const PROHIBITED_PATTERNS = [
  // Prescription medications
  /\b(amoxicillin|trimethoprim|ciprofloxacin|nitrofurantoin|metronidazole|doxycycline|azithromycin|cephalexin|sulfamethoxazole)\b/i,
  // Definitive diagnosis language
  /\byou (definitely|certainly|clearly|definitely) have\b/i,
  /\bthis is (definitely|certainly|clearly) (a|an) (UTI|PCOS|PCOD|infection)\b/i,
  /\bI (can confirm|confirm that) you have\b/i,
  /\bdiagnosed with\b/i,
  // Prescription instructions
  /\btake (\d+)mg\b/i,
  /\bprescription (medication|drug|antibiotic)\b/i,
  /\bget a prescription\b/i,
  // Dangerous advice
  /\bstop taking\b.*\bmedication\b/i,
  /\bdo not see a doctor\b/i,
  /\bdoctor is not necessary\b/i,
]

const WARNING_PATTERNS = [
  // Soft language that should be checked
  /\bI diagnose\b/i,
  /\bmedical diagnosis\b/i,
]

export interface SafetyCheckResult {
  safe: boolean
  flags: string[]
  sanitizedContent: string
}

export function validateAIResponse(content: string): SafetyCheckResult {
  const flags: string[] = []
  let sanitizedContent = content

  // Check for prohibited patterns
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(content)) {
      flags.push(`Prohibited pattern detected: ${pattern.source}`)
    }
  }

  // If unsafe, replace content with a safe fallback
  if (flags.length > 0) {
    sanitizedContent = `I'm here to provide health education and general wellness information. For the specific medical question you've asked, consulting a qualified healthcare professional would give you the most accurate and personalized guidance. They can properly evaluate your situation and provide appropriate care.

If you have a general question about women's health, UTI awareness, cycle education, or wellness habits, I'd be happy to help with that educational information.`
  }

  return {
    safe: flags.length === 0,
    flags,
    sanitizedContent,
  }
}

// Check if a response recommends emergency care appropriately
export function checkEscalationNeeded(userMessage: string): boolean {
  const emergencyPatterns = [
    /\b(chest pain|difficulty breathing|unconscious|severe bleeding|blood in urine)\b/i,
    /\b(fever over|temperature of) (39|40|41|42|103|104|105)\b/i,
    /\bsigns of (sepsis|septic shock)\b/i,
    /\b(flank|back) pain.*(fever|chills)\b/i,
    /\b(can't|cannot) (urinate|pee|pass urine)\b/i,
  ]

  return emergencyPatterns.some((p) => p.test(userMessage))
}

export const EMERGENCY_RESPONSE = `The symptoms you've described may require immediate medical attention. Please:

**🚨 Seek prompt medical care:**
- Contact your healthcare provider immediately
- Visit an urgent care clinic or emergency department if symptoms are severe
- Do not delay seeking professional medical evaluation

This is not something I can adequately address through a health education platform. Your safety is the priority.`
