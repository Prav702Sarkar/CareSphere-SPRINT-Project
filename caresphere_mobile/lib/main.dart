import 'package:flutter/material.dart';
import 'core/services/supabase_service.dart';
import 'core/theme/app_theme.dart';
import 'features/splash/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase Client
  try {
    await SupabaseService.initialize();
  } catch (e) {
    debugPrint('[Supabase Init Warning]: $e');
  }

  runApp(const CareSphereApp());
}

class CareSphereApp extends StatelessWidget {
  const CareSphereApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CareSphere',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.womanTheme,
      home: const SplashScreen(),
    );
  }
}
