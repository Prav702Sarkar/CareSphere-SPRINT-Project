import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';

class CycleTrackingScreen extends StatefulWidget {
  const CycleTrackingScreen({super.key});

  @override
  State<CycleTrackingScreen> createState() => _CycleTrackingScreenState();
}

class _CycleTrackingScreenState extends State<CycleTrackingScreen> {
  DateTime _currentMonth = DateTime.now();
  final Set<int> _periodDays = {1, 2, 3, 4, 5};
  final int _cycleDay = 8;
  final int _cycleLength = 28;

  void _previousMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1);
    });
  }

  void _showLogPeriodModal() {
    DateTime selectedDate = DateTime.now();
    String flow = 'Moderate';
    String cramps = 'Mild';

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
                    'Log Period Entry',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Text(
                'Start Date: ${DateFormat('EEE, MMM d, yyyy').format(selectedDate)}',
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 14),
              Text(
                'Flow Intensity',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Row(
                children: ['Light', 'Moderate', 'Heavy', 'Spotting'].map((f) {
                  final isSel = flow == f;
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 3),
                      child: ChoiceChip(
                        label: Text(f, style: GoogleFonts.inter(fontSize: 11)),
                        selected: isSel,
                        selectedColor: AppColors.womanLight,
                        onSelected: (val) => setModalState(() => flow = f),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 14),
              Text(
                'Cramps & Discomfort',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Row(
                children: ['None', 'Mild', 'Moderate', 'Severe'].map((c) {
                  final isSel = cramps == c;
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 3),
                      child: ChoiceChip(
                        label: Text(c, style: GoogleFonts.inter(fontSize: 11)),
                        selected: isSel,
                        selectedColor: AppColors.womanLight,
                        onSelected: (val) => setModalState(() => cramps = c),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _periodDays.add(selectedDate.day);
                  });
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Period log saved successfully! 🌸')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.womanPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Save Period Log'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final daysInMonth = DateUtils.getDaysInMonth(_currentMonth.year, _currentMonth.month);
    final firstDayOffset = DateTime(_currentMonth.year, _currentMonth.month, 1).weekday % 7;

    return Scaffold(
      appBar: AppBar(
        title: Text('Cycle Tracking', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showLogPeriodModal,
        backgroundColor: AppColors.womanPrimary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Log Period'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Current Phase Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFFDF2F8), Color(0xFFFCE7F3)],
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFFBCFE8)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.womanPrimary.withValues(alpha: 0.15),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: const Icon(Icons.spa_rounded, color: AppColors.womanPrimary, size: 26),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Cycle Day $_cycleDay of $_cycleLength',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppColors.womanPrimaryDark,
                          ),
                        ),
                        Text(
                          'Follicular Phase',
                          style: GoogleFonts.outfit(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        Text(
                          'Energy and focus typically peak as estrogen rises.',
                          style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Calendar Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
                boxShadow: const [
                  BoxShadow(color: AppColors.cardShadow, blurRadius: 12, offset: Offset(0, 3)),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormat('MMMM yyyy').format(_currentMonth),
                        style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold),
                      ),
                      Row(
                        children: [
                          IconButton(
                            onPressed: _previousMonth,
                            icon: const Icon(Icons.chevron_left_rounded),
                          ),
                          IconButton(
                            onPressed: _nextMonth,
                            icon: const Icon(Icons.chevron_right_rounded),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) {
                      return SizedBox(
                        width: 36,
                        child: Text(
                          d,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(fontSize: 12, color: AppColors.textMuted, fontWeight: FontWeight.bold),
                        ),
                      );
                    }).toList(),
                  ),
                  const Divider(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 7,
                      mainAxisSpacing: 6,
                      crossAxisSpacing: 6,
                    ),
                    itemCount: daysInMonth + firstDayOffset,
                    itemBuilder: (context, index) {
                      if (index < firstDayOffset) return const SizedBox();
                      final day = index - firstDayOffset + 1;
                      final isPeriod = _periodDays.contains(day);
                      final isToday = day == DateTime.now().day &&
                          _currentMonth.month == DateTime.now().month &&
                          _currentMonth.year == DateTime.now().year;

                      return Container(
                        decoration: BoxDecoration(
                          color: isPeriod
                              ? AppColors.womanPrimary
                              : isToday
                                  ? AppColors.womanLight
                                  : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: isToday && !isPeriod
                              ? Border.all(color: AppColors.womanPrimary, width: 1.5)
                              : null,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '$day',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: isPeriod || isToday ? FontWeight.bold : FontWeight.normal,
                            color: isPeriod
                                ? Colors.white
                                : isToday
                                    ? AppColors.womanPrimaryDark
                                    : AppColors.textPrimary,
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          color: AppColors.womanPrimary,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text('Period Days', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted)),
                      const SizedBox(width: 20),
                      Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: AppColors.womanLight,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.womanPrimary),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text('Today', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}
