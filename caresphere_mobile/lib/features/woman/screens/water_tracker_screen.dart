import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class WaterTrackerScreen extends StatefulWidget {
  const WaterTrackerScreen({super.key});

  @override
  State<WaterTrackerScreen> createState() => _WaterTrackerScreenState();
}

class _WaterTrackerScreenState extends State<WaterTrackerScreen> {
  int _waterIntakeMl = 1250;
  final int _waterGoalMl = 2000;
  final List<String> _history = ['8:30 AM · 250ml', '11:00 AM · 500ml', '2:15 PM · 500ml'];

  void _addWater(int amount) {
    setState(() {
      _waterIntakeMl = (_waterIntakeMl + amount).clamp(0, 4000);
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
        title: Text('Hydration Tracker', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Progress Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFE0F2FE), Color(0xFFBAE6FD)],
              ),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: const Color(0xFF7DD3FC)),
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
                        valueColor: const AlwaysStoppedAnimation(Color(0xFF0284C7)),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '$percentage%',
                          style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, color: const Color(0xFF0369A1)),
                        ),
                        Text(
                          '$_waterIntakeMl / $_waterGoalMl ml',
                          style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF0284C7)),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  'Hydration supports smooth bladder flushing and cellular energy.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF0369A1)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Quick Log Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _addWater(250),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0284C7),
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
                    backgroundColor: const Color(0xFF0369A1),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.local_drink, size: 16),
                  label: const Text('+500ml Bottle'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          Text('Today\'s Hydration History', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
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
                    Text(h.split(' · ')[1], style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: const Color(0xFF0284C7))),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
