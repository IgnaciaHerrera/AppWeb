import 'dart:convert';
import 'package:http/http.dart' as http;

// Small helper script to GET the /alergias endpoint and print status + body.
// Run with: dart run tool/check_api.dart

Future<void> main() async {
  const url = 'https://05ub3vgx02.execute-api.us-east-1.amazonaws.com/alergias';
  print('Checking GET $url');
  try {
    final resp = await http.get(Uri.parse(url));
    print('Status: ${resp.statusCode}');
    print('Headers: ${resp.headers}');
  final body = resp.body;
    print('Body length: ${body.length}');
    if (body.trim().isEmpty) {
      print('<empty body>');
    } else {
      // Try pretty-printing JSON when possible
      try {
        final decoded = json.decode(body);
        final pretty = const JsonEncoder.withIndent('  ').convert(decoded);
        print('Body (JSON):\n$pretty');
      } catch (_) {
        print('Body (text):\n$body');
      }
    }
  } catch (e, st) {
    print('Request failed: $e');
    print(st);
  }
}
