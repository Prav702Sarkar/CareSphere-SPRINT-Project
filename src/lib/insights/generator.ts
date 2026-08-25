import type { SymptomLog, CycleLog, WaterLog, Insight } from '@/types'

export interface InsightRuleResult {
  type: 'cycle' | 'symptom' | 'hydration' | 'nutrition' | 'lifestyle'
  title: string
  body: string
  data?: Record<string, unknown>
}

/**
 * Deterministic rules-based health insights engine
 * Analyzes user logs to produce educational, non-diagnostic observations
 */
export function generateInsightsFromLogs(params: {
  symptoms: SymptomLog[]
  cycles: CycleLog[]
  waterLogs: WaterLog[]
  hydrationGoalMl?: number
}): InsightRuleResult[] {
  const insights: InsightRuleResult[] = []
  const { symptoms, cycles, waterLogs, hydrationGoalMl = 2000 } = params

  // 1. Hydration Analysis
  if (waterLogs.length > 0) {
    const totalMl = waterLogs.reduce((sum, log) => sum + log.amount_ml, 0)
    const avgDailyMl = totalMl / Math.max(1, Math.min(7, waterLogs.length))
    const goalPercentage = Math.round((avgDailyMl / hydrationGoalMl) * 100)

    if (goalPercentage >= 100) {
      insights.push({
        type: 'hydration',
        title: 'Hydration Goal Achieved',
        body: `You are averaging ${Math.round(avgDailyMl)}ml of water daily, meeting your ${hydrationGoalMl}ml goal. Consistent hydration supports urinary tract flushing and overall metabolic health.`,
        data: { avgDailyMl, goalPercentage },
      })
    } else if (goalPercentage < 70) {
      insights.push({
        type: 'hydration',
        title: 'Hydration Support Opportunity',
        body: `Your daily hydration is averaging around ${Math.round(avgDailyMl)}ml (${goalPercentage}% of your ${hydrationGoalMl}ml target). Increasing water intake throughout the morning and afternoon can help support urinary health and energy levels.`,
        data: { avgDailyMl, goalPercentage },
      })
    }
  }

  // 2. Symptom Frequency & Pattern Analysis
  if (symptoms.length > 0) {
    const frequencyMap: Record<string, number> = {}
    symptoms.forEach((s) => {
      frequencyMap[s.symptom_name] = (frequencyMap[s.symptom_name] || 0) + 1
    })

    const sortedSymptoms = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])
    const [topSymptom, topCount] = sortedSymptoms[0]

    if (topCount >= 3) {
      insights.push({
        type: 'symptom',
        title: `Pattern Noticed: ${topSymptom}`,
        body: `You have logged "${topSymptom}" ${topCount} times recently. Logging accompanying notes such as sleep, nutrition, and timing can help you discuss any recurring patterns with your healthcare provider.`,
        data: { symptom: topSymptom, count: topCount },
      })
    }

    // Check for severe symptoms
    const severeLogs = symptoms.filter((s) => s.severity === 'severe')
    if (severeLogs.length > 0) {
      insights.push({
        type: 'symptom',
        title: 'Severe Symptom Logged',
        body: `You recently recorded a severe symptom (${severeLogs[0].symptom_name}). While CareSphere provides education, we encourage consulting a doctor promptly for severe or worsening symptoms.`,
        data: { severeSymptoms: severeLogs.map((s) => s.symptom_name) },
      })
    }
  }

  // 3. Menstrual Cycle Pattern Analysis
  if (cycles.length >= 2) {
    const sorted = [...cycles].sort(
      (a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime()
    )
    const diffDays = Math.round(
      (new Date(sorted[0].period_start).getTime() - new Date(sorted[1].period_start).getTime()) /
        (1000 * 60 * 60 * 24)
    )

    if (diffDays >= 21 && diffDays <= 35) {
      insights.push({
        type: 'cycle',
        title: 'Regular Cycle Interval',
        body: `Your recorded cycle length was approximately ${diffDays} days, which falls within the typical 21–35 day range.`,
        data: { cycleLengthDays: diffDays },
      })
    } else if (diffDays > 0) {
      insights.push({
        type: 'cycle',
        title: 'Cycle Variation Observed',
        body: `Your recorded interval between periods was ${diffDays} days. Occasional cycle variation can happen due to stress, travel, sleep, or hormonal fluctuations. Consider discussing continued variations with a doctor.`,
        data: { cycleLengthDays: diffDays },
      })
    }
  }

  return insights
}
