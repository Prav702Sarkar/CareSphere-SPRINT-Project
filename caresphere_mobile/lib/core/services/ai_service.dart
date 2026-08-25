import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';

class AIService {
  static const String womanSystemPrompt = '''
You are the CareSphere AI Health Assistant for women. You specialize in women's wellness, menstrual cycle education, PCOS/PCOD guidance, and UTI prevention.
Follow these clinical safety rules:
1. Always maintain an empathetic, encouraging, and supportive tone.
2. NEVER provide definitive medical diagnoses or prescribe specific antibiotic dosages.
3. Recommend hydration, hygiene habits, and consulting a healthcare professional for persistent or severe symptoms.
4. Keep answers concise, formatted with clear bullet points.
''';

  static const String manSystemPrompt = '''
You are the CareSphere AI Health Assistant for boys and men. You specialize in male urological wellness, UTI awareness, preventative habits, and hydration.
Follow these clinical safety rules:
1. Normalize conversations around male urinary health with clarity and confidence.
2. Emphasize prevention: proper hydration, hygiene, and timely urination.
3. NEVER prescribe antibiotic dosages. Direct users to seek medical evaluation for painful urination or fever.
''';

  static Future<String> sendMessage({
    required String message,
    required bool isWoman,
    List<Map<String, String>> history = const [],
  }) async {
    try {
      final systemPrompt = isWoman ? womanSystemPrompt : manSystemPrompt;

      final messages = [
        {'role': 'system', 'content': systemPrompt},
        ...history,
        {'role': 'user', 'content': message},
      ];

      final response = await http.post(
        Uri.parse(ApiConstants.groqEndpoint),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${ApiConstants.groqApiKey}',
        },
        body: jsonEncode({
          'model': ApiConstants.groqModel,
          'messages': messages,
          'temperature': 0.7,
          'max_tokens': 600,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final reply = data['choices']?[0]?['message']?['content'] ??
            'I am here to help support your health education.';
        return reply;
      } else {
        return 'I am currently prioritizing safe health guidance. Please stay well-hydrated and reach out to a healthcare professional for specific clinical diagnoses.';
      }
    } catch (e) {
      return 'CareSphere is here for your wellness guidance. Please drink plenty of fluids and consult a doctor if experiencing acute symptoms.';
    }
  }
}
