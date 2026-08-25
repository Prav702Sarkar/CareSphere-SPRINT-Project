// ============================================================
// DATABASE TYPES — Generated from Supabase schema
// ============================================================

export type UserRole = 'woman' | 'man'

export type LifestyleType = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'

export type AgeGroup = 'under_18' | '18_24' | '25_34' | '35_44' | '45_54' | '55_plus'

export type DietaryType = 'vegetarian' | 'vegan' | 'non_vegetarian' | 'pescatarian' | 'other'

export type FlowLevel = 'light' | 'moderate' | 'heavy' | 'spotting'

export type MoodLevel = 'very_low' | 'low' | 'neutral' | 'good' | 'great'

export type EnergyLevel = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high'

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown'

export type SymptomCategory =
  | 'menstrual'
  | 'uti'
  | 'pcos_pcod'
  | 'digestive'
  | 'emotional'
  | 'physical'
  | 'other'

export type SymptomSeverity = 'mild' | 'moderate' | 'severe'

export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'dinner'

export type PartnerRequestStatus = 'pending' | 'approved' | 'rejected' | 'revoked'

export type SharedDataCategory =
  | 'cycle_status'
  | 'period_dates'
  | 'uti_information'
  | 'pcos_pcod_details'
  | 'nutrition_plan'
  | 'hydration'
  | 'selected_symptoms'
  | 'selected_insights'

export type ArticleCategory =
  | 'uti'
  | 'pcos_pcod'
  | 'menstrual_health'
  | 'nutrition'
  | 'prevention'
  | 'general_women_health'
  | 'boys_uti_education'

export type TargetExperience = 'women' | 'boys' | 'both'

export interface HealthArticle {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: ArticleCategory
  topics: string[]
  target_experience: TargetExperience
  tags: string[]
  read_time_minutes: number
  source: string
  source_url?: string | null
  version: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RAGSearchResult {
  id: string
  title: string
  summary: string
  content: string
  category: ArticleCategory
  topics: string[]
  target_experience: TargetExperience
  similarity?: number
  relevanceScore?: number
}

export interface UserProfile {
  id: string
  clerk_id: string
  email: string
  name: string
  role: UserRole
  age_group: AgeGroup | null
  lifestyle: LifestyleType | null
  onboarding_complete: boolean
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface HealthProfile {
  id: string
  user_id: string
  cycle_length: number | null
  period_duration: number | null
  last_period_start: string | null
  is_cycle_regular: boolean | null
  conditions: string[]
  dietary_type: DietaryType | null
  dietary_restrictions: string[]
  dietary_goals: string[]
  sleep_hours: number | null
  activity_level: LifestyleType | null
  stress_level: number | null // 1-10
  hydration_goal_ml: number
  health_concerns: string[]
  created_at: string
  updated_at: string
}

export interface SymptomLog {
  id: string
  user_id: string
  symptom_name: string
  category: SymptomCategory
  severity: SymptomSeverity
  duration_hours: number | null
  notes: string | null
  logged_at: string
  created_at: string
}

export interface CycleLog {
  id: string
  user_id: string
  period_start: string
  period_end: string | null
  flow: FlowLevel | null
  cramps: SymptomSeverity | null
  mood: MoodLevel | null
  energy: EnergyLevel | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface WaterLog {
  id: string
  user_id: string
  amount_ml: number
  logged_at: string
  created_at: string
}

export interface WaterReminder {
  id: string
  user_id: string
  time: string // HH:MM
  enabled: boolean
  days_of_week: number[] // 0=Sun, 6=Sat
  created_at: string
}

export interface MealReminder {
  id: string
  user_id: string
  meal_type: MealType
  time: string // HH:MM
  enabled: boolean
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  meal_type: MealType
  items: string[]
  notes: string | null
  logged_at: string
  created_at: string
}

export interface AIConversation {
  id: string
  user_id: string
  user_type: UserRole
  title: string | null
  created_at: string
  updated_at: string
}

export interface AIMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface Insight {
  id: string
  user_id: string
  type: 'cycle' | 'symptom' | 'hydration' | 'nutrition' | 'lifestyle'
  title: string
  body: string
  data: Record<string, unknown> | null
  generated_at: string
}

export interface LovedOne {
  id: string
  user_id: string
  partner_user_id: string
  partner_name: string
  partner_email: string
  relationship: 'partner' | 'parent' | 'sibling' | 'other'
  status: PartnerRequestStatus
  created_at: string
  updated_at: string
}

export interface PartnerRequest {
  id: string
  requester_id: string
  requester_name: string
  requester_email: string
  target_email: string
  status: PartnerRequestStatus
  message: string | null
  created_at: string
  updated_at: string
}

export interface PartnerConsent {
  id: string
  woman_id: string
  man_id: string
  verified_at: string
  active: boolean
  created_at: string
}

export interface SharedDataPermission {
  id: string
  consent_id: string
  category: SharedDataCategory
  allowed: boolean
  updated_at: string
}

export interface OTPVerification {
  id: string
  user_id: string
  purpose: string
  hashed_otp: string
  expires_at: string
  used_at: string | null
  attempt_count: number
  created_at: string
}

// ============================================================
// APP TYPES
// ============================================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface OnboardingData {
  // Basic
  name: string
  ageGroup: AgeGroup
  role: UserRole
  lifestyle: LifestyleType

  // Menstrual (woman only)
  lastPeriodDate?: string
  cycleLength?: number
  periodDuration?: number
  isCycleRegular?: boolean
  generalSymptomPatterns?: string[]

  // Health awareness
  conditions?: string[]
  healthConcerns?: string[]

  // Lifestyle
  sleepHours?: number
  activityLevel?: LifestyleType
  stressLevel?: number

  // Nutrition & Goals
  dietaryType?: DietaryType
  dietaryRestrictions?: string[]
  dietaryGoals?: string[]
  dailyWaterTarget?: number
  primaryGoal?: string
}

export type ThemeType = 'woman' | 'man'

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}
