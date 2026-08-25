import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../ai_chat/ai_assistant_screen.dart';
import 'screens/man_uti_screen.dart';
import 'screens/man_water_screen.dart';
import 'screens/man_self_care_screen.dart';
import 'screens/man_loved_ones_screen.dart';
import 'screens/man_profile_screen.dart';

class ManHomeScreen extends StatefulWidget {
  const ManHomeScreen({super.key});

  @override
  State<ManHomeScreen> createState() => _ManHomeScreenState();
}

class _ManHomeScreenState extends State<ManHomeScreen> {
  int _currentTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      _buildHomeDashboardTab(),
      const ManUTIScreen(),
      const ManWaterScreen(),
      const ManLovedOnesScreen(),
      const AIAssistantScreen(isWoman: false),
    ];

    return Scaffold(
      drawer: _buildDrawer(),
      body: screens[_currentTabIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentTabIndex,
        onDestinationSelected: (idx) => setState(() => _currentTabIndex = idx),
        indicatorColor: AppColors.manLight,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: AppColors.manPrimary),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.shield_outlined),
            selectedIcon: Icon(Icons.shield_rounded, color: AppColors.manPrimary),
            label: 'UTI Guide',
          ),
          NavigationDestination(
            icon: Icon(Icons.water_drop_outlined),
            selectedIcon: Icon(Icons.water_drop_rounded, color: AppColors.manPrimary),
            label: 'Water',
          ),
          NavigationDestination(
            icon: Icon(Icons.favorite_border_rounded),
            selectedIcon: Icon(Icons.favorite_rounded, color: AppColors.manPrimary),
            label: 'Partner',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome_outlined),
            selectedIcon: Icon(Icons.auto_awesome, color: AppColors.manPrimary),
            label: 'AI Chat',
          ),
        ],
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.manPrimary, AppColors.manSecondary],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                  child: const Icon(Icons.shield_rounded, color: AppColors.manPrimary, size: 24),
                ),
                const SizedBox(height: 10),
                Text('CareSphere Men', style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                Text('Boys & Men Urological Wellness', style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
              ],
            ),
          ),
          _buildDrawerItem(Icons.shield_outlined, 'UTI Awareness & Prevention', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ManUTIScreen()));
          }),
          _buildDrawerItem(Icons.directions_run_rounded, 'Daily Self-Care Routine', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ManSelfCareScreen()));
          }),
          _buildDrawerItem(Icons.water_drop_outlined, 'Hydration & Fluid Tracker', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ManWaterScreen()));
          }),
          _buildDrawerItem(Icons.favorite_border_rounded, 'Partner Health Records', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ManLovedOnesScreen()));
          }),
          const Divider(),
          _buildDrawerItem(Icons.person_outline_rounded, 'Profile & Settings', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ManProfileScreen()));
          }),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.manPrimary, size: 20),
      title: Text(title, style: GoogleFonts.inter(fontSize: 13.5, fontWeight: FontWeight.w600)),
      onTap: onTap,
    );
  }

  Widget _buildHomeDashboardTab() {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [AppColors.manPrimary, AppColors.manSecondary]),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.shield_rounded, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 8),
            Text('CareSphere Men', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ManLovedOnesScreen()));
            },
            icon: const Icon(Icons.favorite_rounded, color: AppColors.manPrimary),
            tooltip: 'Partner Records',
          ),
          IconButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ManProfileScreen()));
            },
            icon: const Icon(Icons.account_circle_outlined),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFF0FDFA), Color(0xFFCCFBF1)]),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF99F6E4)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Urological Wellness 🛡️', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.manPrimaryDark)),
                  const SizedBox(height: 4),
                  Text('Proactive Urinary Health', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Active hydration habits, infection defense, and partner awareness.', style: GoogleFonts.inter(fontSize: 12.5, color: AppColors.textSecondary)),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text('Core Wellness Hubs', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.35,
              children: [
                _buildHubCard('UTI Awareness', 'Symptoms & defense', Icons.shield_outlined, const Color(0xFFF0FDFA), AppColors.manPrimary, () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const ManUTIScreen()));
                }),
                _buildHubCard('Daily Routine', 'Hygiene & fitness', Icons.directions_run_rounded, const Color(0xFFECFDF5), const Color(0xFF059669), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const ManSelfCareScreen()));
                }),
                _buildHubCard('Hydration Log', '2,500ml daily target', Icons.water_drop_outlined, const Color(0xFFE0F2FE), const Color(0xFF0284C7), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const ManWaterScreen()));
                }),
                _buildHubCard('Partner View', 'Live shared records', Icons.favorite_border_rounded, const Color(0xFFFDF2F8), AppColors.womanPrimary, () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const ManLovedOnesScreen()));
                }),
              ],
            ),
            const SizedBox(height: 20),

            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => setState(() => _currentTabIndex = 4),
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppColors.manPrimary, AppColors.manSecondary]),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.auto_awesome, color: Colors.white, size: 24),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('24/7 AI Health Companion', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                            Text('Ask male urological and UTI questions anonymously', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white70)),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white, size: 16),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildHubCard(String title, String subtitle, IconData icon, Color bgColor, Color iconColor, VoidCallback onTap) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: bgColor, shape: BoxShape.circle),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold)),
                  Text(subtitle, style: GoogleFonts.inter(fontSize: 10.5, color: AppColors.textMuted)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
