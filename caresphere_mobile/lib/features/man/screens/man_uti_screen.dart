import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class ManUTIScreen extends StatelessWidget {
  const ManUTIScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Male UTI Awareness', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF0FDFA), Color(0xFFCCFBF1)],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFF99F6E4)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.shield_rounded, color: AppColors.manPrimary, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Urinary Health for Men',
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.manPrimaryDark,
                        ),
                      ),
                      Text(
                        'Normalizing proactive urological wellness and timely prevention.',
                        style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          Text('Symptoms in Men', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildInfoTile('Pain or burning while urinating (Dysuria)', 'A sharp discomfort or burning sensation in the urethra during voiding.'),
          _buildInfoTile('Frequent & Urgent Urination', 'Needing to pass urine more often than usual, especially waking up multiple times at night.'),
          _buildInfoTile('Pelvic or Lower Abdominal Heaviness', 'Dull ache located above the pubic bone or between the scrotum and anus (perineum).'),
          const SizedBox(height: 20),

          Text('Preventative Routine', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildInfoTile('Drink 2.5–3 Liters Daily', 'Frequent urination physically sweeps bacteria out of the urinary tract.'),
          _buildInfoTile('Prompt Post-Exercise Hygiene', 'Change out of sweaty gym clothes promptly to prevent moisture-associated bacterial growth.'),
          _buildInfoTile('Never Hold Urination', 'Voiding when the urge arises prevents bacterial multiplication in static urine.'),
        ],
      ),
    );
  }

  Widget _buildInfoTile(String title, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(desc, style: GoogleFonts.inter(fontSize: 12.5, color: AppColors.textSecondary, height: 1.4)),
        ],
      ),
    );
  }
}
