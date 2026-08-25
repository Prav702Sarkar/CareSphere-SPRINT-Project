import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class PCOSPCODScreen extends StatelessWidget {
  const PCOSPCODScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('PCOS / PCOD Awareness', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF5F3FF), Color(0xFFEDE9FE)],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFDDD6FE)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.biotech_outlined, color: Color(0xFF7C3AED), size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hormonal Vitality Guide',
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF4C1D95),
                        ),
                      ),
                      Text(
                        'Understanding the metabolic & endocrine factors of PCOS/PCOD.',
                        style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF5B21B6)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          Text('Key Pillars of Management', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildPillarTile(
            title: '1. Glycemic Balance',
            desc: 'Pair complex carbohydrates with protein and healthy fats to stabilize insulin and reduce androgenic spikes.',
            icon: Icons.grain_rounded,
          ),
          _buildPillarTile(
            title: '2. Consistent Rest & Circadian Rhythm',
            desc: '7–8 hours of quality sleep reduces cortisol, aiding regular ovulation and metabolic recovery.',
            icon: Icons.bedtime_outlined,
          ),
          _buildPillarTile(
            title: '3. Stress Modulation & Movement',
            desc: 'Strength training and low-intensity steady-state (LISS) exercise support insulin sensitivity without adrenal fatigue.',
            icon: Icons.fitness_center_rounded,
          ),
          _buildPillarTile(
            title: '4. Anti-Inflammatory Nutrition',
            desc: 'Rich dietary fiber, omega-3s (flaxseeds, walnuts), and antioxidant berries support ovarian health.',
            icon: Icons.restaurant_menu_rounded,
          ),
        ],
      ),
    );
  }

  Widget _buildPillarTile({required String title, required String desc, required IconData icon}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFF5F3FF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: const Color(0xFF7C3AED), size: 18),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.bold)),
                const SizedBox(height: 3),
                Text(desc, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
