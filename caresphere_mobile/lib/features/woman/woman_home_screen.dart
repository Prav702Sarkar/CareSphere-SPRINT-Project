import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../ai_chat/ai_assistant_screen.dart';
import 'screens/cycle_tracking_screen.dart';
import 'screens/symptom_logger_screen.dart';
import 'screens/water_tracker_screen.dart';
import 'screens/uti_education_screen.dart';
import 'screens/pcos_pcod_screen.dart';
import 'screens/nutrition_guide_screen.dart';
import 'screens/remedies_screen.dart';
import 'screens/health_insights_screen.dart';
import 'screens/woman_loved_ones_screen.dart';
import 'screens/woman_profile_screen.dart';

class WomanHomeScreen extends StatefulWidget {
  const WomanHomeScreen({super.key});

  @override
  State<WomanHomeScreen> createState() => _WomanHomeScreenState();
}

class _WomanHomeScreenState extends State<WomanHomeScreen> {
  int _currentTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      _buildHomeDashboardTab(),
      const CycleTrackingScreen(),
      const SymptomLoggerScreen(),
      const WaterTrackerScreen(),
      const AIAssistantScreen(isWoman: true),
    ];

    return Scaffold(
      drawer: _buildDrawer(),
      body: screens[_currentTabIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentTabIndex,
        onDestinationSelected: (idx) => setState(() => _currentTabIndex = idx),
        indicatorColor: AppColors.womanLight,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: AppColors.womanPrimary),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month_outlined),
            selectedIcon: Icon(Icons.calendar_month_rounded, color: AppColors.womanPrimary),
            label: 'Cycle',
          ),
          NavigationDestination(
            icon: Icon(Icons.health_and_safety_outlined),
            selectedIcon: Icon(Icons.health_and_safety_rounded, color: AppColors.womanPrimary),
            label: 'Symptoms',
          ),
          NavigationDestination(
            icon: Icon(Icons.water_drop_outlined),
            selectedIcon: Icon(Icons.water_drop_rounded, color: AppColors.womanPrimary),
            label: 'Water',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome_outlined),
            selectedIcon: Icon(Icons.auto_awesome, color: AppColors.womanPrimary),
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
                colors: [AppColors.womanPrimary, AppColors.womanSecondary],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                  child: const Icon(Icons.favorite_rounded, color: AppColors.womanPrimary, size: 24),
                ),
                const SizedBox(height: 10),
                Text('CareSphere', style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                Text('Women\'s Health & Wellness', style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
              ],
            ),
          ),
          _buildDrawerItem(Icons.water_drop_outlined, 'UTI Awareness & Prevention', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const UTIEducationScreen()));
          }),
          _buildDrawerItem(Icons.biotech_outlined, 'PCOS / PCOD Management', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const PCOSPCODScreen()));
          }),
          _buildDrawerItem(Icons.restaurant_menu_rounded, 'Phase Nutrition & Meals', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const NutritionGuideScreen()));
          }),
          _buildDrawerItem(Icons.spa_outlined, 'Home Comfort & Remedies', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const RemediesScreen()));
          }),
          _buildDrawerItem(Icons.insights_rounded, 'Health Insights & Trends', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const HealthInsightsScreen()));
          }),
          _buildDrawerItem(Icons.favorite_border_rounded, 'Loved Ones & Partner Code', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const WomanLovedOnesScreen()));
          }),
          const Divider(),
          _buildDrawerItem(Icons.person_outline_rounded, 'Profile & Settings', () {
            Navigator.pop(context);
            Navigator.push(context, MaterialPageRoute(builder: (_) => const WomanProfileScreen()));
          }),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.womanPrimary, size: 20),
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
                gradient: LinearGradient(colors: [AppColors.womanPrimary, AppColors.womanSecondary]),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.favorite_rounded, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 8),
            Text('CareSphere', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const WomanLovedOnesScreen()));
            },
            icon: const Icon(Icons.favorite_rounded, color: AppColors.womanPrimary),
            tooltip: 'Loved Ones',
          ),
          IconButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const WomanProfileScreen()));
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
            // Welcome Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFFDF2F8), Color(0xFFFCE7F3)]),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFFBCFE8)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Good Day 🌸', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.womanPrimaryDark)),
                  const SizedBox(height: 4),
                  Text('Cycle Day 8 · Follicular Phase', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Energy is rising. Great window for active hydration, creativity, and nutritious foods.', style: GoogleFonts.inter(fontSize: 12.5, color: AppColors.textSecondary)),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Quick Hub Grid
            Text('Health & Wellness Hubs', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.35,
              children: [
                _buildHubCard('UTI Awareness', 'Prevention & red flags', Icons.water_drop_outlined, const Color(0xFFE0F2FE), const Color(0xFF0284C7), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const UTIEducationScreen()));
                }),
                _buildHubCard('PCOS / PCOD', 'Hormonal balance', Icons.biotech_outlined, const Color(0xFFF5F3FF), const Color(0xFF7C3AED), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const PCOSPCODScreen()));
                }),
                _buildHubCard('Phase Nutrition', 'Cycle meal guides', Icons.restaurant_menu_rounded, const Color(0xFFECFDF5), const Color(0xFF059669), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const NutritionGuideScreen()));
                }),
                _buildHubCard('Home Remedies', 'Soothing cramp care', Icons.spa_outlined, const Color(0xFFFFFBEB), const Color(0xFFD97706), () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const RemediesScreen()));
                }),
              ],
            ),
            const SizedBox(height: 20),

            // AI Companion Banner
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => setState(() => _currentTabIndex = 4),
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppColors.womanPrimary, AppColors.womanSecondary]),
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
                            Text('Ask confidential cycle & UTI questions', style: GoogleFonts.inter(fontSize: 11.5, color: Colors.white70)),
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
