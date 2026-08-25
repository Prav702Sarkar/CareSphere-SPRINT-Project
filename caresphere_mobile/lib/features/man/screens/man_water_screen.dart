import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class ManWaterScreen extends StatefulWidget {
  const ManWaterScreen({super.key});

  @override
  State<ManWaterScreen> createState() => _ManWaterScreenState();
}

class _ManWaterScreenState extends State<ManWaterScreen> {
  int _waterIntakeMl = 1500;
  final int _waterGoalMl = 2500;
  final List<String> _history = ['7:30 AM · 500ml', '11:15 AM · 500ml', '2:45 PM · 500ml'];

  void _addWater(int amount) {
    setState(() {
      _waterIntakeMl = (_waterIntakeMl + amount).clamp(0, 5000);
      final now = TimeOfDay.now();
      _history.insert(0, '${now.format(context)} · ${amount}ml');
    });
  }

  @override
  Widget build(BuildContext context) {
    final progress = (_waterIntakeMl / _waterGoalMl).clamp(0.0, 1.0);
    final percentage = (progress * 100).toInt();

    return Scaffold(
      appBar: AppBar(
        title: Text('Hydration & Electrolytes', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF0FDFA), Color(0xFFCCFBF1)],
              ),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: const Color(0xFF99F6E4)),
            ),
            child: Column(
              children: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 140,
                      height: 140,
                      child: CircularProgressIndicator(
                        value: progress,
                        strokeWidth: 12,
                        backgroundColor: Colors.white.withValues(alpha: 0.5),
                        valueColor: const AlwaysStoppedAnimation(AppColors.manPrimary),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '$percentage%',
                          style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.manPrimaryDark),
                        ),
                        Text(
                          '$_waterIntakeMl / $_waterGoalMl ml',
                          style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.manPrimary),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  'Adequate fluid intake protects kidney filtration and flushes the urological tract.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(fontSize: 12, color: AppColors.manPrimaryDark),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _addWater(250),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.manPrimary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.water_drop, size: 16),
                  label: const Text('+250ml Glass'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _addWater(500),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.manPrimaryDark,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.local_drink, size: 16),
                  label: const Text('+500ml Shaker'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          Text('Today\'s Fluid Logs', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ..._history.map((h) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(h.split(' · ')[0], style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                    Text(h.split(' · ')[1], style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.manPrimaryDark)),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
