import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/api_constants.dart';

class SupabaseService {
  static SupabaseClient get client => Supabase.instance.client;

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: ApiConstants.supabaseUrl,
      // ignore: deprecated_member_use
      anonKey: ApiConstants.supabaseAnonKey,
    );
  }

  // Get current active connection code or fallback
  static Future<String> getConnectionCode() async {
    try {
      final user = client.auth.currentUser;
      if (user != null) {
        final res = await client
            .from('profiles')
            .select('connection_code')
            .eq('id', user.id)
            .maybeSingle();
        if (res != null && res['connection_code'] != null) {
          return res['connection_code'] as String;
        }
      }
    } catch (_) {}
    return 'CARE-8492';
  }

  // Connect with partner via code
  static Future<bool> connectWithCode({
    required String code,
    required bool isWoman,
  }) async {
    try {
      final user = client.auth.currentUser;
      if (user == null) return true;

      final target = await client
          .from('profiles')
          .select('id, name')
          .eq('connection_code', code.trim().toUpperCase())
          .maybeSingle();

      if (target != null) {
        await client.from('partner_connections').upsert({
          'sharer_id': isWoman ? user.id : target['id'],
          'viewer_id': isWoman ? target['id'] : user.id,
          'status': isWoman ? 'approved' : 'pending',
          'permissions': ['cycle_status', 'hydration', 'uti_information'],
        });
        return true;
      }
    } catch (_) {}
    return true;
  }
}
