import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class SymptomLoggerScreen extends StatefulWidget {
  const SymptomLoggerScreen({super.key});

  @override
  State<SymptomLoggerScreen> createState() => _SymptomLoggerScreenState();
}

class _SymptomLoggerScreenState extends State<SymptomLoggerScreen> {
  final List<Map<String, dynamic>> _symptomLogs = [
    {'name': 'Cramps', 'category': 'Menstrual', 'severity': 'Mild', 'time': '2 hrs ago'},
    {'name': 'Fatigue', 'category': 'Physical', 'severity': 'Mild', 'time': '5 hrs ago'},
  ];

  final Map<String, List<String>> _commonSymptoms = {
    'Menstrual': ['Cramps', 'Bloating', 'Lower Back Pain', 'Breast Tenderness'],
    'UTI Awareness': ['Burning Sensation', 'Frequent Urination', 'Pelvic Pressure', 'Cloudy Urine'],
    'PCOS / PCOD': ['Acne Flare', 'Irregular Spotting', 'Hair Thinning', 'Mood Swings'],
    'Physical': ['Fatigue', 'Headache', 'Low Energy', 'Sleep Disturbance'],
  };

  void _showAddSymptomModal() {
    String selectedCategory = 'Menstrual';
    String selectedSymptom = 'Cramps';
    String selectedSeverity = 'Mild';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Log a Symptom',
                    style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close)),
                ],
              ),
              const SizedBox(height: 12),
              Text('Category', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Wrap(
                spacing: 6,
                children: _commonSymptoms.keys.map((cat) {
                  final isSel = selectedCategory == cat;
                  return ChoiceChip(
                    label: Text(cat, style: GoogleFonts.inter(fontSize: 11)),
                    selected: isSel,
                    selectedColor: AppColors.womanLight,
                    onSelected: (val) {
                      setModalState(() {
                        selectedCategory = cat;
                        selectedSymptom = _commonSymptoms[cat]!.first;
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 14),
              Text('Specific Symptom', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Wrap(
                spacing: 6,
                children: (_commonSymptoms[selectedCategory] ?? []).map((sym) {
                  final isSel = selectedSymptom == sym;
                  return ChoiceChip(
                    label: Text(sym, style: GoogleFonts.inter(fontSize: 11)),
                    selected: isSel,
                    selectedColor: AppColors.womanLight,
                    onSelected: (val) => setModalState(() => selectedSymptom = sym),
                  );
                }).toList(),
              ),
              const SizedBox(height: 14),
              Text('Severity', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Row(
                children: ['Mild', 'Moderate', 'Severe'].map((sev) {
                  final isSel = selectedSeverity == sev;
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: ChoiceChip(
                        label: Text(sev, style: GoogleFonts.inter(fontSize: 11)),
                        selected: isSel,
                        selectedColor: AppColors.womanLight,
                        onSelected: (val) => setModalState(() => selectedSeverity = sev),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _symptomLogs.insert(0, {
                      'name': selectedSymptom,
                      'category': selectedCategory,
                      'severity': selectedSeverity,
                      'time': 'Just now',
                    });
                  });
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Symptom logged successfully! 🩺')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.womanPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Save Symptom'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Symptom Logger', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddSymptomModal,
        backgroundColor: AppColors.womanPrimary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Log Symptom'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Header card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(
                    color: AppColors.womanLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.health_and_safety_outlined, color: AppColors.womanPrimary),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Track Daily Discomfort',
                        style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Monitor patterns to identify cycle correlations & UTI triggers.',
                        style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          Text(
            'Recent Logged Symptoms',
            style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),

          if (_symptomLogs.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(40.0),
                child: Text('No symptoms logged yet today.', style: GoogleFonts.inter(color: AppColors.textMuted)),
              ),
            )
          else
            ..._symptomLogs.map((log) {
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.womanLight,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.favorite_border, color: AppColors.womanPrimary, size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            log['name'],
                            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            '${log['category']} · ${log['time']}',
                            style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: log['severity'] == 'Severe'
                            ? const Color(0xFFFEE2E2)
                            : log['severity'] == 'Moderate'
                                ? const Color(0xFFFEF3C7)
                                : const Color(0xFFD1FAE5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        log['severity'],
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: log['severity'] == 'Severe'
                              ? const Color(0xFFB91C1C)
                              : log['severity'] == 'Moderate'
                                  ? const Color(0xFFB45309)
                                  : const Color(0xFF047857),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}
