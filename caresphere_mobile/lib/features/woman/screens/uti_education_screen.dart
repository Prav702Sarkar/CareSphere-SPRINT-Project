import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class UTIEducationScreen extends StatelessWidget {
  const UTIEducationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('UTI Awareness & Prevention', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Emergency Red Flag Callout
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFFECACA)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.warning_amber_rounded, color: Color(0xFFDC2626), size: 22),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'When to Seek Immediate Care',
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF991B1B),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'If you experience high fever, severe flank/back pain, vomiting, or visible blood in urine, contact a physician promptly as it may indicate an upper kidney infection.',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: const Color(0xFF7F1D1D),
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          Text('Common Symptoms', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildInfoTile(
            icon: Icons.local_fire_department_outlined,
            title: 'Dysuria (Burning Urination)',
            desc: 'A stinging or burning sensation during or immediately after passing urine.',
          ),
          _buildInfoTile(
            icon: Icons.repeat_rounded,
            title: 'Urinary Urgency & Frequency',
            desc: 'Feeling the frequent, persistent urge to urinate, often passing only small volumes.',
          ),
          _buildInfoTile(
            icon: Icons.shield_outlined,
            title: 'Pelvic Pressure & Discomfort',
            desc: 'A heavy sensation or aching discomfort centered around the pubic bone.',
          ),
          const SizedBox(height: 20),

          Text('Preventative Habits', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildInfoTile(
            icon: Icons.water_drop_outlined,
            title: 'Active Hydration',
            desc: 'Drinking 2–2.5L of water daily naturally flushes bacteria before colonization.',
          ),
          _buildInfoTile(
            icon: Icons.access_time_rounded,
            title: 'Timely Voiding',
            desc: 'Avoid holding urine for extended periods. Urinate after intimacy to clear the tract.',
          ),
          _buildInfoTile(
            icon: Icons.eco_outlined,
            title: 'Hygiene Practices',
            desc: 'Always wipe front-to-back and choose breathable cotton clothing to prevent bacterial migration.',
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required String title,
    required String desc,
  }) {
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
              color: AppColors.womanLight,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.womanPrimary, size: 18),
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
