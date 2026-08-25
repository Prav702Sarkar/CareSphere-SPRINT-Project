import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/supabase_service.dart';

class WomanLovedOnesScreen extends StatefulWidget {
  const WomanLovedOnesScreen({super.key});

  @override
  State<WomanLovedOnesScreen> createState() => _WomanLovedOnesScreenState();
}

class _WomanLovedOnesScreenState extends State<WomanLovedOnesScreen> {
  String _myCode = 'CARE-8492';
  bool _copied = false;
  final TextEditingController _codeController = TextEditingController();

  final List<Map<String, dynamic>> _incomingRequests = [
    {
      'id': 'req_1',
      'name': 'Alex (Partner)',
      'email': 'alex@example.com',
      'permissions': ['cycle_status', 'hydration', 'uti_information'],
    }
  ];

  final List<Map<String, dynamic>> _activePartners = [];

  final Map<String, String> _categoryLabels = {
    'cycle_status': '🌸 Cycle Phase & Days',
    'period_dates': '🩸 Period Log Dates',
    'hydration': '💧 Daily Hydration %',
    'uti_information': '🚽 UTI Awareness & Status',
    'selected_symptoms': '🩺 Logged Symptoms',
    'pcos_pcod_details': '🧬 PCOS / PCOD Balance',
    'nutrition_plan': '🥗 Phase Meal Tips',
    'selected_insights': '📊 AI Health Insights',
  };

  @override
  void initState() {
    super.initState();
    _loadMyCode();
  }

  Future<void> _loadMyCode() async {
    final code = await SupabaseService.getConnectionCode();
    if (mounted) setState(() => _myCode = code);
  }

  void _copyCode() {
    Clipboard.setData(ClipboardData(text: _myCode));
    setState(() => _copied = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  void _acceptRequest(int index) {
    final req = _incomingRequests.removeAt(index);
    _activePartners.add(req);
    setState(() {});
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Access granted to ${req['name']}! ❤️')),
    );
  }

  void _revokePartner(int index) {
    final partner = _activePartners.removeAt(index);
    setState(() {});
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Access revoked for ${partner['name']}.')),
    );
  }

  void _showConnectModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
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
                  'Connect with Partner Code',
                  style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close)),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Enter your partner\'s 6-character connection code to link.',
              style: GoogleFonts.inter(fontSize: 12.5, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _codeController,
              textCapitalization: TextCapitalization.characters,
              style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 2),
              decoration: InputDecoration(
                hintText: 'e.g. CARE-4921',
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                final code = _codeController.text.trim();
                if (code.isNotEmpty) {
                  setState(() {
                    _activePartners.add({
                      'id': 'partner_${DateTime.now().millisecondsSinceEpoch}',
                      'name': 'Partner ($code)',
                      'permissions': ['cycle_status', 'hydration', 'uti_information'],
                    });
                  });
                  _codeController.clear();
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Partner linked successfully! 🌸')),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.womanPrimary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Authorize & Connect'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Loved Ones & Sharing', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            onPressed: _showConnectModal,
            icon: const Icon(Icons.person_add_alt_1_rounded, color: AppColors.womanPrimary),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Code Display Card
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.womanPrimary.withValues(alpha: 0.3), width: 1.5),
              boxShadow: const [
                BoxShadow(color: AppColors.cardShadow, blurRadius: 16, offset: Offset(0, 4)),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.womanLight,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Your Share Code',
                    style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.womanPrimary),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _myCode,
                  style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, letterSpacing: 3, color: AppColors.womanPrimary),
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: _copyCode,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _copied ? AppColors.success : AppColors.womanPrimary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: Icon(_copied ? Icons.check : Icons.copy, size: 16),
                  label: Text(_copied ? 'Copied' : 'Copy Code'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Incoming Requests
          if (_incomingRequests.isNotEmpty) ...[
            Text('Incoming Authorization Requests', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ..._incomingRequests.asMap().entries.map((entry) {
              final idx = entry.key;
              final req = entry.value;
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFFED7AA)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(req['name'], style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(
                      'Requests permission to view your wellness records.',
                      style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => _acceptRequest(idx),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.womanPrimary,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text('Accept & Grant'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () {
                            setState(() => _incomingRequests.removeAt(idx));
                          },
                          style: OutlinedButton.styleFrom(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          child: const Text('Decline'),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 16),
          ],

          // Active Connections
          Text('Connected Loved Ones', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          if (_activePartners.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  const Icon(Icons.people_outline_rounded, size: 36, color: AppColors.textMuted),
                  const SizedBox(height: 8),
                  Text('No connected partners yet.', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textMuted)),
                  const SizedBox(height: 4),
                  Text('Share your code or enter their code to connect.', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted)),
                ],
              ),
            )
          else
            ..._activePartners.asMap().entries.map((entry) {
              final idx = entry.key;
              final partner = entry.value;
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
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(partner['name'], style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold)),
                        IconButton(
                          onPressed: () => _revokePartner(idx),
                          icon: const Icon(Icons.delete_outline, color: AppColors.error),
                          tooltip: 'Revoke Access',
                        ),
                      ],
                    ),
                    const Divider(height: 12),
                    Text('Shared Categories:', style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: ((partner['permissions'] as List<dynamic>?) ?? []).map((p) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.womanLight,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            _categoryLabels[p.toString()] ?? p.toString(),
                            style: GoogleFonts.inter(fontSize: 10.5, color: AppColors.womanPrimaryDark),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }
}
