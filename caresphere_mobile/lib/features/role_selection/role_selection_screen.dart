import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/theme/app_theme.dart';
import '../woman/woman_home_screen.dart';
import '../man/man_home_screen.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  Future<void> _selectRole(BuildContext context, String role) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('caresphere_user_role', role);

    if (!context.mounted) return;
    if (role == 'woman') {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const WomanHomeScreen()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const ManHomeScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.auto_awesome, size: 14, color: AppColors.womanPrimary),
                      const SizedBox(width: 6),
                      Text(
                        'Welcome to CareSphere',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Select Your Health Experience',
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Choose the wellness portal tailored for your body and health journey.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 32),

              // Option 1: Woman Portal
              Expanded(
                child: _buildRoleCard(
                  context: context,
                  title: "I'm a Woman",
                  subtitle: "Women's Health & Cycle Platform",
                  desc: "Cycle tracking, ovulation estimates, PCOS/PCOD wellness guides, UTI prevention & AI companion.",
                  icon: Icons.favorite_rounded,
                  gradient: const [AppColors.womanPrimary, AppColors.womanSecondary],
                  bgLight: AppColors.womanLight,
                  borderColor: AppColors.womanPrimary.withValues(alpha: 0.3),
                  onTap: () => _selectRole(context, 'woman'),
                ),
              ),
              const SizedBox(height: 16),

              // Option 2: Boy / Man Portal
              Expanded(
                child: _buildRoleCard(
                  context: context,
                  title: "I'm a Boy / Man",
                  subtitle: "Boys' UTI & Urological Wellness",
                  desc: "Male urinary health, UTI awareness, preventative hydration & consent-based partner access.",
                  icon: Icons.shield_rounded,
                  gradient: const [AppColors.manPrimary, AppColors.manSecondary],
                  bgLight: AppColors.manLight,
                  borderColor: AppColors.manPrimary.withValues(alpha: 0.3),
                  onTap: () => _selectRole(context, 'man'),
                ),
              ),
              const SizedBox(height: 20),

              Center(
                child: Text(
                  '🔒 100% Private · Granular Consent · RLS Encrypted',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    color: AppColors.textMuted,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard({
    required BuildContext context,
    required String title,
    required String subtitle,
    required String desc,
    required IconData icon,
    required List<Color> gradient,
    required Color bgLight,
    required Color borderColor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: borderColor, width: 1.5),
            boxShadow: const [
              BoxShadow(
                color: AppColors.cardShadow,
                blurRadius: 16,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: gradient),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(icon, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          subtitle,
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: gradient[0],
                          ),
                        ),
                        Text(
                          title,
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Text(
                desc,
                style: GoogleFonts.inter(
                  fontSize: 12.5,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Enter Portal',
                    style: GoogleFonts.outfit(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: gradient[0],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: bgLight,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.arrow_forward_rounded, size: 16, color: gradient[0]),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
