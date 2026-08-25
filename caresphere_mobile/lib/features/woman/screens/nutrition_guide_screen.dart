import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class NutritionGuideScreen extends StatelessWidget {
  const NutritionGuideScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Phase-Aligned Nutrition', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFECFDF5), Color(0xFFD1FAE5)],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFA7F3D0)),
            ),
            child: Row(
              children: [
                const Icon(Icons.eco_rounded, color: Color(0xFF059669), size: 30),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Sync Food with Your Hormones',
                        style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold, color: const Color(0xFF065F46)),
                      ),
                      Text(
                        'Nourish specific metabolic requirements across all 4 cycle phases.',
                        style: GoogleFonts.inter(fontSize: 11.5, color: const Color(0xFF047857)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          _buildPhaseMealCard(
            phase: '🩸 Menstrual Phase (Days 1–5)',
            focus: 'Iron & Anti-Inflammatory Replenishment',
            foods: 'Warm bone broths, spinach, lentils, beets, ginger tea, and pumpkin seeds.',
            color: const Color(0xFFBE123C),
            bgColor: const Color(0xFFFFF1F2),
          ),
          _buildPhaseMealCard(
            phase: '🌱 Follicular Phase (Days 6–13)',
            focus: 'Estrogen Metabolism & Light Energy',
            foods: 'Fermented foods (kimchi/kefir), sprouted grains, fresh greens, citrus fruits, and lean proteins.',
            color: const Color(0xFF6D28D9),
            bgColor: const Color(0xFFF5F3FF),
          ),
          _buildPhaseMealCard(
            phase: '🌸 Ovulation Window (Days 14–16)',
            focus: 'Glutathione & Fiber Support',
            foods: 'Cruciferous veggies (broccoli, cauliflower), dark berries, flaxseeds, and plenty of electrolyte water.',
            color: const Color(0xFFB45309),
            bgColor: const Color(0xFFFFFBEB),
          ),
          _buildPhaseMealCard(
            phase: '🌙 Luteal Phase (Days 17–28)',
            focus: 'Magnesium & Blood Sugar Stability',
            foods: 'Sweet potatoes, dark chocolate (70%+), roasted chickpeas, brown rice, walnuts, and herbal chamomile.',
            color: const Color(0xFF1D4ED8),
            bgColor: const Color(0xFFEFF6FF),
          ),
        ],
      ),
    );
  }

  Widget _buildPhaseMealCard({
    required String phase,
    required String focus,
    required String foods,
    required Color color,
    required Color bgColor,
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
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              phase,
              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: color),
            ),
          ),
          const SizedBox(height: 10),
          Text(focus, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(
            foods,
            style: GoogleFonts.inter(fontSize: 12.5, color: AppColors.textSecondary, height: 1.4),
          ),
        ],
      ),
    );
  }
}
