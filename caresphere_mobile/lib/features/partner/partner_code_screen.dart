import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../core/services/supabase_service.dart';

class PartnerCodeScreen extends StatefulWidget {
  final bool isWoman;
  const PartnerCodeScreen({super.key, required this.isWoman});

  @override
  State<PartnerCodeScreen> createState() => _PartnerCodeScreenState();
}

class _PartnerCodeScreenState extends State<PartnerCodeScreen> {
  String _myCode = 'CARE-8492';
  final TextEditingController _partnerCodeController = TextEditingController();
  bool _copied = false;
  bool _connecting = false;
  String? _statusMsg;

  @override
  void initState() {
    super.initState();
    _loadCode();
  }

  Future<void> _loadCode() async {
    final code = await SupabaseService.getConnectionCode();
    if (mounted) {
      setState(() => _myCode = code);
    }
  }

  void _copyCode() {
    Clipboard.setData(ClipboardData(text: _myCode));
    setState(() => _copied = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  Future<void> _connectCode() async {
    final code = _partnerCodeController.text.trim();
    if (code.isEmpty) return;

    setState(() {
      _connecting = true;
      _statusMsg = null;
    });

    final success = await SupabaseService.connectWithCode(
      code: code,
      isWoman: widget.isWoman,
    );

    if (!mounted) return;
    setState(() {
      _connecting = false;
      _statusMsg = success
          ? (widget.isWoman
              ? '✅ Connected with partner! You can configure permissions anytime.'
              : '✅ Request sent to partner! Live updates will appear once approved.')
          : '❌ Could not connect. Please check the code.';
    });
  }

  @override
  void dispose() {
    _partnerCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = widget.isWoman ? AppColors.womanPrimary : AppColors.manPrimary;
    final lightColor = widget.isWoman ? AppColors.womanLight : AppColors.manLight;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Loved Ones & Partner Code',
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Code Display Card
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: primaryColor.withValues(alpha: 0.3), width: 1.5),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.cardShadow,
                    blurRadius: 16,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: lightColor,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'Your Personal Share Code',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: primaryColor,
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    _myCode,
                    style: GoogleFonts.outfit(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 3,
                      color: primaryColor,
                    ),
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton.icon(
                    onPressed: _copyCode,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _copied ? AppColors.success : primaryColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    ),
                    icon: Icon(_copied ? Icons.check : Icons.copy, size: 16),
                    label: Text(_copied ? 'Copied to Clipboard' : 'Copy Code'),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Share this 6-character code with your partner to link accounts.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Enter Partner's Code Section
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
                  Text(
                    "Have Your Partner's Code?",
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Enter their 6-character code to link records with consent.',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _partnerCodeController,
                    textCapitalization: TextCapitalization.characters,
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                    decoration: InputDecoration(
                      hintText: 'e.g. CARE-9382',
                      hintStyle: GoogleFonts.outfit(
                        fontSize: 15,
                        color: AppColors.textMuted,
                        letterSpacing: 1,
                      ),
                      filled: true,
                      fillColor: AppColors.background,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppColors.border),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _connecting ? null : _connectCode,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: _connecting
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation(Colors.white),
                              ),
                            )
                          : Text(
                              'Authorize & Connect',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                  if (_statusMsg != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      _statusMsg!,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _statusMsg!.startsWith('✅')
                            ? AppColors.success
                            : AppColors.error,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
