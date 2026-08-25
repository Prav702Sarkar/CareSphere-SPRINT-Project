class ApiConstants {
  static const String appName = 'CareSphere';
  static const String appTagline = "Women's Health & UTI Awareness Platform";

  // Supabase Configuration
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://bngrfrictoapkkwondak.supabase.co',
  );
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.caresphere_anon_key',
  );

  // Groq Cloud AI Configuration
  static const String groqApiKey = String.fromEnvironment(
    'GROQ_API_KEY',
    defaultValue: 'gsk_caresphere_groq_api_key_placeholder',
  );
  static const String groqEndpoint =
      'https://api.groq.com/openai/v1/chat/completions';
  static const String groqModel = 'llama-3.3-70b-versatile';

  // Local Backend API (Android Emulator uses 10.0.2.2)
  static const String backendBaseUrl = 'http://10.0.2.2:3000';
}
