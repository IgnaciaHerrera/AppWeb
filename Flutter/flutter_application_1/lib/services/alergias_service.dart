import 'dart:convert';

import 'api_client.dart';

class AlergiasService {
  static final ApiClient _api = ApiClient();
  static const String _baseUrl =
      'https://05ub3vgx02.execute-api.us-east-1.amazonaws.com/alergias';

  /// Obtiene los nombres de alergias (compatibilidad con código previo).
  static Future<List<String>> fetchAlergias() async {
    final resp = await _api.get(_baseUrl);
    if (resp == null) return <String>[];
    if (resp is List) {
      return resp.map((e) => (e is Map && e['nombre'] != null) ? e['nombre'].toString() : e.toString()).toList();
    }
    if (resp is String) {
      try {
        final decoded = json.decode(resp);
        if (decoded is List) return decoded.map((e) => e['nombre'].toString()).toList();
      } catch (_) {}
    }
    throw Exception('Respuesta inesperada al obtener alergias');
  }

  /// Crea una nueva alergia; envía el [body] como JSON.
  static Future<Map<String, dynamic>?> createAlergia(Map<String, dynamic> body) async {
    final resp = await _api.post(_baseUrl, body: body);
    if (resp == null) return null;
    if (resp is Map<String, dynamic>) return resp;
    if (resp is String) {
      try {
        return json.decode(resp) as Map<String, dynamic>;
      } catch (_) {
        return <String, dynamic>{'result': resp};
      }
    }
    return null;
  }

  /// Obtiene la lista completa de alergias como objetos (permitiendo acceder a ids).
  static Future<List<Map<String, dynamic>>> fetchAllAlergias() async {
    final resp = await _api.get(_baseUrl);
    if (resp == null) return <Map<String, dynamic>>[];
    if (resp is List) {
      return List<Map<String, dynamic>>.from(resp.map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{'nombre': e.toString()}));
    }
    if (resp is String) {
      try {
        final decoded = json.decode(resp);
        if (decoded is List) return List<Map<String, dynamic>>.from(decoded);
      } catch (_) {}
    }
    throw Exception('Respuesta inesperada al obtener alergias (objetos)');
  }

  static Future<Map<String, dynamic>?> updateAlergia(String id, Map<String, dynamic> body) async {
    final uri = '$_baseUrl/$id';
    try {
      final resp = await _api.put(uri, body: body);
      if (resp == null) return null;
      if (resp is Map<String, dynamic>) return resp;
      if (resp is String) {
        try {
          return json.decode(resp) as Map<String, dynamic>;
        } catch (_) {
          return <String, dynamic>{'result': resp};
        }
      }
      return null;
    } catch (e) {
      // If server complains about missing idAlergia in path, try alternative PUT variants.
      try {
        if (e is ApiException && (e.body?.toLowerCase().contains('idalergia') ?? false)) {
          // 1) Try PUT with id as query parameter: /alergias?idAlergia={id}
          final altUri = '$_baseUrl?id=$id';
          try {
            print('[AlergiasService] retrying update using query param PUT: $altUri');
            final altResp = await _api.put(altUri, body: body);
            if (altResp == null) return null;
            if (altResp is Map<String, dynamic>) return altResp;
            if (altResp is String) {
              try { return json.decode(altResp) as Map<String, dynamic>; } catch (_) { return <String, dynamic>{'result': altResp}; }
            }
          } catch (altErr) {
            print('[AlergiasService] query-param PUT failed: $altErr');
            // 2) Try PUT to base URL with id in body (some backends expect id in payload)
            try {
              final retryBody = Map<String, dynamic>.from(body);
              retryBody['idAlergia'] = int.tryParse(id) ?? id;
              print('[AlergiasService] retrying update by sending idAlergia in body to base URL (PUT)');
              final retryResp = await _api.put(_baseUrl, body: retryBody);
              if (retryResp == null) return null;
              if (retryResp is Map<String, dynamic>) return retryResp;
              if (retryResp is String) {
                try { return json.decode(retryResp) as Map<String, dynamic>; } catch (_) { return <String, dynamic>{'result': retryResp}; }
              }
            } catch (bodyErr) {
              print('[AlergiasService] PUT with id in body also failed: $bodyErr');
              // Do NOT perform POST fallback automatically — it may attempt to create a record and cause duplicate primary key errors.
              // Surface a clearer error so the caller can decide (and backend can be fixed if necessary).
              if (bodyErr is ApiException) {
                throw ApiException('Update failed: ${bodyErr.message}', statusCode: bodyErr.statusCode, body: bodyErr.body);
              }
              rethrow;
            }
          }
        }
      } catch (_) {}
      rethrow;
    }
  }

  /// Elimina una alergia por [id]. Devuelve true si la petición no lanzó excepción.
  static Future<bool> deleteAlergia(String id) async {
    final uri = '$_baseUrl/$id';
    try {
      await _api.delete(uri);
      return true;
    } catch (e) {
      // If server complains about missing idAlergia in path, retry using query parameter fallback
      try {
        if (e is ApiException && (e.body?.toLowerCase().contains('idalergia') ?? false)) {
          final alt = '$_baseUrl?idAlergia=$id';
          print('[AlergiasService] retrying delete using query param: $alt');
          await _api.delete(alt);
          return true;
        }
      } catch (_) {}
      rethrow;
    }
  }
}
