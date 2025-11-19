// lib/services/extinct_api_service.dart

/*import 'package:dio/dio.dart';
import '../models/extinct_animal.dart';

class ExtinctApiService {
  static const String _endpoint =
      'https://extinct-api.herokuapp.com/api/v1/animal/';

  final Dio _dio = Dio();

  Future<ExtinctAnimal> fetchRandomAnimal() async {
    try {
      final response = await _dio.get(_endpoint);

      if (response.statusCode == 200) {
        final data = response.data;

        if (data is Map<String, dynamic> &&
            data['status'] == 'success' &&
            data['data'] is List &&
            data['data'].isNotEmpty) {
          final first = data['data'][0] as Map<String, dynamic>;
          return ExtinctAnimal.fromJson(first);
        } else {
          throw Exception('Formato inesperado de respuesta');
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Error al obtener el animal: $e');
    }
  }
}
*/