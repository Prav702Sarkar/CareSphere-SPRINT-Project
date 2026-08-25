import 'package:flutter_test/flutter_test.dart';
import 'package:caresphere_mobile/main.dart';

void main() {
  testWidgets('CareSphere app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const CareSphereApp());
    await tester.pumpAndSettle(const Duration(seconds: 3));
    expect(find.text('CareSphere'), findsWidgets);
  });
}
