import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/theme/app_theme.dart';
import '../../role_selection/role_selection_screen.dart';

class WomanProfileScreen extends StatelessWidget {
  const WomanProfileScreen({super.key});

  Future<void> _logout(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Log Out'),
        content: const Text('Are you sure you want to switch or log out of your profile?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('caresphere_user_role');
      if (context.mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const RoleSelectionScreen()),
          (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile & Settings', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Profile Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.womanPrimary, AppColors.womanSecondary],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person_rounded, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('CareSphere Member', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
                      Text('Women\'s Health Portal', style: GoogleFonts.inter(fontSize: 12, color: AppColors.womanPrimary, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Menu Options
          _buildSettingsGroup([
            _buildSettingTile(icon: Icons.notifications_none_rounded, title: 'Hydration & Period Reminders', subtitle: 'Push notifications active'),
            _buildSettingTile(icon: Icons.security_rounded, title: 'Privacy & Partner Sharing', subtitle: 'Manage granular data consent'),
            _buildSettingTile(icon: Icons.description_outlined, title: 'Medical Disclaimer', subtitle: 'Educational companion terms'),
          ]),
          const SizedBox(height: 20),

          // Logout Button
          ElevatedButton.icon(
            onPressed: () => _logout(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFEF2F2),
              foregroundColor: AppColors.error,
              elevation: 0,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: Color(0xFFFECACA)),
              ),
            ),
            icon: const Icon(Icons.logout_rounded),
            label: const Text('Switch Role / Log Out'),
          ),
          const SizedBox(height: 20),
          Center(
            child: Text(
              'CareSphere Mobile v1.0.0 · RLS Encrypted',
              style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsGroup(List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(children: children),
    );
  }

  Widget _buildSettingTile({required IconData icon, required String title, required String subtitle}) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: const BoxDecoration(
          color: AppColors.womanLight,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.womanPrimary, size: 18),
      ),
      title: Text(title, style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.bold)),
      subtitle: Text(subtitle, style: GoogleFonts.inter(fontSize: 11.5, color: AppColors.textMuted)),
      trailing: const Icon(Icons.chevron_right_rounded, size: 18, color: AppColors.textMuted),
    );
  }
}
