import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class ManSelfCareScreen extends StatelessWidget {
  const ManSelfCareScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Daily Self-Care & Routine', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF0FDFA), Color(0xFFCCFBF1)],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF99F6E4)),
            ),
            child: Row(
              children: [
                const Icon(Icons.directions_run_rounded, color: AppColors.manPrimary, size: 28),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Urological & Physical Health', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.manPrimaryDark)),
                      Text('Daily habits that support kidney wellness and infection defense.', style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.manPrimaryDark)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          _buildHabitTile(
            icon: Icons.local_drink_outlined,
            title: 'Morning 500ml Hydration Kickstart',
            desc: 'Drinking water upon waking stimulates kidney glomerular filtration and flushes overnight urinary stasis.',
          ),
          _buildHabitTile(
            icon: Icons.shower_outlined,
            title: 'Post-Workout Hygiene Routine',
            desc: 'Bacterial colonies thrive in moist athletic gear. Shower and change promptly following training.',
          ),
          _buildHabitTile(
            icon: Icons.chair_outlined,
            title: 'Avoid Extended Inactive Sitting',
            desc: 'Stand or stretch every 60 minutes to relieve pelvic floor compression and improve perineal circulation.',
          ),
          _buildHabitTile(
            icon: Icons.bedtime_outlined,
            title: 'Nighttime Hydration Pacing',
            desc: 'Drink the majority of your water during daylight to reduce sleep disruptions and nocturia.',
          ),
        ],
      ),
    );
  }

  Widget _buildHabitTile({required IconData icon, required String title, required String desc}) {
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
            decoration: const BoxDecoration(
              color: AppColors.manLight,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.manPrimary, size: 18),
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
