import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/supabase_service.dart';

class ManLovedOnesScreen extends StatefulWidget {
  const ManLovedOnesScreen({super.key});

  @override
  State<ManLovedOnesScreen> createState() => _ManLovedOnesScreenState();
}

class _ManLovedOnesScreenState extends State<ManLovedOnesScreen> {
  String _myCode = 'CARE-3918';
  bool _copied = false;
  final TextEditingController _partnerCodeController = TextEditingController();
  bool _isConnected = true;
  String _partnerName = 'Sarah';

  @override
  void initState() {
    super.initState();
    _loadCode();
  }

  Future<void> _loadCode() async {
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

  void _disconnect() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Disconnect Partner View'),
        content: const Text('Are you sure you want to disconnect from this partner view?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() => _isConnected = false);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Disconnected from partner view.')),
              );
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Disconnect'),
          ),
        ],
      ),
    );
  }

  void _connectCode() {
    final code = _partnerCodeController.text.trim();
    if (code.isNotEmpty) {
      setState(() {
        _isConnected = true;
        _partnerName = 'Partner ($code)';
      });
      _partnerCodeController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Connected to partner! Live health records synced.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Partner Access & Sharing', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Personal Share Code Card
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.manPrimary.withValues(alpha: 0.3), width: 1.5),
              boxShadow: const [
                BoxShadow(color: AppColors.cardShadow, blurRadius: 16, offset: Offset(0, 4)),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.manLight,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Your Personal Connection Code',
                    style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.manPrimary),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _myCode,
                  style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, letterSpacing: 3, color: AppColors.manPrimary),
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: _copyCode,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _copied ? AppColors.success : AppColors.manPrimary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: Icon(_copied ? Icons.check : Icons.copy, size: 16),
                  label: Text(_copied ? 'Copied to Clipboard' : 'Copy Share Code'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          if (!_isConnected) ...[
            // Connect with Code Box
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Enter Her Connection Code', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  Text('Enter her 6-character code to request authorized partner view.', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _partnerCodeController,
                    textCapitalization: TextCapitalization.characters,
                    style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 2),
                    decoration: InputDecoration(
                      hintText: 'e.g. CARE-8492',
                      filled: true,
                      fillColor: AppColors.background,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppColors.border),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _connectCode,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.manPrimary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('Send Connection Request'),
                    ),
                  ),
                ],
              ),
            ),
          ] else ...[
            // Active Live Shared Records
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('$_partnerName\'s Shared Records', style: GoogleFonts.outfit(fontSize: 17, fontWeight: FontWeight.bold)),
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 6),
                        Text('Live Real-Time Sync', style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.success, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
                OutlinedButton.icon(
                  onPressed: _disconnect,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.error,
                    side: const BorderSide(color: Color(0xFFFECACA)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: const Icon(Icons.link_off, size: 14),
                  label: const Text('Disconnect', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
            const SizedBox(height: 14),

            _buildSharedTile('🌸 Cycle Status', 'Follicular Phase · Day 8', 'Energy rising steadily', const Color(0xFFFDF2F8), AppColors.womanPrimary),
            _buildSharedTile('🩸 Period Dates', 'Last period ended 3 days ago', 'Flow was moderate, mild cramps', const Color(0xFFFFF1F2), const Color(0xFFBE123C)),
            _buildSharedTile('💧 Daily Hydration', '1,250 / 2,000 ml (62%)', 'Good progress today', const Color(0xFFE0F2FE), const Color(0xFF0284C7)),
            _buildSharedTile('🚽 UTI Status', 'Optimal · No active symptoms', 'Hydration target maintained', const Color(0xFFECFDF5), const Color(0xFF059669)),
            _buildSharedTile('🩺 Recent Symptoms', 'Mild fatigue noted', 'Rest and hydration advised', const Color(0xFFFFFBEB), const Color(0xFFD97706)),
            _buildSharedTile('🥗 Nutrition Focus', 'Phase 2: Light grains & greens', 'Antioxidants & iron focus', const Color(0xFFF5F3FF), const Color(0xFF7C3AED)),
          ],
        ],
      ),
    );
  }

  Widget _buildSharedTile(String title, String status, String note, Color bgColor, Color accentColor) {
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
              Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
                child: Text(status, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: accentColor)),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(note, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
