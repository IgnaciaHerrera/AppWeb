import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

class ApiException implements Exception {
  final int? statusCode;
  final String message;
  final String? body;

  ApiException(this.message, {this.statusCode, this.body});

  @override
  String toString() => 'ApiException(status: $statusCode, message: $message, body: $body)';
}

/// Lightweight HTTP client with defensive parsing and optional retry to an alternate base URL.
class ApiClient {
  final Duration timeout;
  final String? alternateBase;

  ApiClient({this.timeout = const Duration(seconds: 15), this.alternateBase});

  Future<dynamic> get(String url) => _send('GET', url);
  Future<dynamic> post(String url, {dynamic body}) => _send('POST', url, body: body);
  Future<dynamic> put(String url, {dynamic body}) => _send('PUT', url, body: body);
  Future<dynamic> patch(String url, {dynamic body}) => _send('PATCH', url, body: body);
  Future<dynamic> delete(String url) => _send('DELETE', url);

  Future<dynamic> _send(String method, String url, {dynamic body}) async {
    print('[ApiClient] $method -> $url');
    if (body != null) print('[ApiClient] payload: ${body is String ? body : jsonEncode(body)}');

    try {
      http.Response resp;
      final headers = {'Content-Type': 'application/json'};

      switch (method) {
        case 'GET':
          resp = await http.get(Uri.parse(url)).timeout(timeout);
          break;
        case 'POST':
          resp = await http.post(Uri.parse(url), headers: headers, body: jsonEncode(body)).timeout(timeout);
          break;
        case 'PUT':
          resp = await http.put(Uri.parse(url), headers: headers, body: jsonEncode(body)).timeout(timeout);
          break;
        case 'PATCH':
          resp = await http.patch(Uri.parse(url), headers: headers, body: jsonEncode(body)).timeout(timeout);
          break;
        case 'DELETE':
          resp = await http.delete(Uri.parse(url), headers: headers).timeout(timeout);
          break;
        default:
          throw ApiException('Unsupported HTTP method: $method');
      }

      print('[ApiClient] response status: ${resp.statusCode}');
  final bodyText = resp.body;
      print('[ApiClient] response length: ${bodyText.length}');

      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        if (bodyText.trim().isEmpty) return null;
        try {
          return json.decode(bodyText);
        } catch (_) {
          // Not JSON, return raw text
          return bodyText;
        }
      }

      // Non-2xx: inspect body for common proxy-miss HTML like "Cannot POST /api/..."
      final lower = bodyText.toLowerCase();
      // Log the full body for diagnostics (helpful for 500 responses)
      if (bodyText.trim().isNotEmpty) {
        print('[ApiClient] non-2xx response body:\n$bodyText');
      }
      final proxyMiss = RegExp(r"cannot\s+(post|put|delete|patch)\s+/api", caseSensitive: false);
      if (alternateBase != null && proxyMiss.hasMatch(lower)) {
        try {
          print('[ApiClient] Detected proxy-miss HTML response, retrying against alternate base');
          final alt = _buildAlternateUrl(url);
          print('[ApiClient] Retry $method -> $alt');
          // Retry once
          return await _send(method, alt, body: body);
        } catch (e) {
          print('[ApiClient] Alternate retry failed: $e');
        }
      }

      // Otherwise throw with details
      throw ApiException('HTTP ${resp.statusCode}', statusCode: resp.statusCode, body: bodyText);
    } on SocketException catch (e) {
      print('[ApiClient] Network error: $e');
      throw ApiException('Network error: $e');
    } on http.ClientException catch (e) {
      print('[ApiClient] Client exception: $e');
      throw ApiException('Client exception: $e');
    }
  }

  String _buildAlternateUrl(String original) {
    if (alternateBase == null) return original;
    try {
      final uri = Uri.parse(original);
      var path = uri.path;
      // Remove leading /api if present
      if (path.startsWith('/api')) path = path.substring(4);
      // Ensure alternateBase doesn't end with a slash
      final base = alternateBase!.endsWith('/') ? alternateBase!.substring(0, alternateBase!.length - 1) : alternateBase!;
      return base + path + (uri.hasQuery ? '?${uri.query}' : '');
    } catch (_) {
      return original;
    }
  }
}
