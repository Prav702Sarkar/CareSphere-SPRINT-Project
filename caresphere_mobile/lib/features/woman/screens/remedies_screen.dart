import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class RemediesScreen extends StatelessWidget {
  const RemediesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Comfort & Home Remedies', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFFFBEB), Color(0xFFFEF3C7)],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFFDE68A)),
            ),
            child: Row(
              children: [
                const Icon(Icons.spa_outlined, color: Color(0xFFD97706), size: 28),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Gentle Wellness Support',
                        style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold, color: const Color(0xFF92400E)),
                      ),
                      Text(
                        'Evidence-backed comfort measures for menstrual cramps and urinary tract health.',
                        style: GoogleFonts.inter(fontSize: 11.5, color: const Color(0xFFB45309)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          Text('For Menstrual Cramps & Pelvic Tension', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildRemedyCard(
            title: '🔥 Heat Therapy (Heating Pad)',
            desc: 'Applying gentle warmth to the lower abdomen relaxes uterine muscles and boosts local blood flow, significantly easing cramping.',
          ),
          _buildRemedyCard(
            title: '🫖 Warm Ginger & Chamomile Tea',
            desc: 'Ginger exhibits mild anti-inflammatory prostaglandin reduction, while chamomile promotes smooth muscle relaxation.',
          ),
          _buildRemedyCard(
            title: '🧘‍♀️ Child\'s Pose & Cat-Cow Stretch',
            desc: 'Gentle restorative yoga decompresses the lower spine, pelvis, and pelvic floor ligaments.',
          ),
          const SizedBox(height: 20),

          Text('For Urinary Tract Soothing', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _buildRemedyCard(
            title: '💧 Pure Hydration Flushing',
            desc: 'Drinking a large glass of warm water every 90 minutes reduces bacterial adherence in the bladder epithelium.',
          ),
          _buildRemedyCard(
            title: '🫐 Pure Cranberry PACs (Sugar-Free)',
            desc: 'Proanthocyanidins (PACs) help inhibit E. coli from binding to urothelial cells. Avoid sugary juices.',
          ),
        ],
      ),
    );
  }

  Widget _buildRemedyCard({required String title, required String desc}) {
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
