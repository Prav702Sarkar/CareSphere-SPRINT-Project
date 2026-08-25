import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class HealthInsightsScreen extends StatelessWidget {
  const HealthInsightsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Health Insights', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFDF2F8), Color(0xFFFCE7F3)],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFFBCFE8)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.insights_rounded, color: AppColors.womanPrimary, size: 24),
                    const SizedBox(width: 10),
                    Text(
                      'AI Health Pattern Analysis',
                      style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.womanPrimaryDark),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Based on your logged cycles, symptoms, and hydration habits.',
                  style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          _buildInsightCard(
            title: '🌸 Cycle Predictability: Regular (28 Days)',
            desc: 'Your recent menstrual intervals indicate balanced follicular and luteal timing.',
            tag: 'Optimal Rhythm',
            tagColor: AppColors.success,
          ),
          _buildInsightCard(
            title: '💧 Hydration Consistency: 85% Target',
            desc: 'Maintaining 2,000ml/day significantly lowers risk factors for urinary tract discomfort.',
            tag: 'Well Hydrated',
            tagColor: const Color(0xFF0284C7),
          ),
          _buildInsightCard(
            title: '🩺 Mild Fatigue in Follicular Transition',
            desc: 'Consider gentle iron-rich meals and magnesium snacks to support active cellular energy.',
            tag: 'Nutritional Tip',
            tagColor: const Color(0xFFD97706),
          ),
        ],
      ),
    );
  }

  Widget _buildInsightCard({
    required String title,
    required String desc,
    required String tag,
    required Color tagColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: tagColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  tag,
                  style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: tagColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(title, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(desc, style: GoogleFonts.inter(fontSize: 12.5, color: AppColors.textSecondary, height: 1.4)),
        ],
      ),
    );
  }
}
