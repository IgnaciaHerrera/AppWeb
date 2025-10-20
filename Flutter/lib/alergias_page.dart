import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AlergiasPage extends StatefulWidget {
  const AlergiasPage({super.key});

  @override
  State<AlergiasPage> createState() => _AlergiasPageState();
}

class _AlergiasPageState extends State<AlergiasPage> {
  List<dynamic> alergias = [];
  bool isLoading = true;
  String? errorMessage;

  // 👇 Cambia este link por tu endpoint real
  final String apiUrl = 'https://clc8mu24re.execute-api.us-east-1.amazonaws.com/alergias';

  @override
  void initState() {
    super.initState();
    fetchAlergias();
  }

  Future<void> fetchAlergias() async {
    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        setState(() {
          alergias = data; // asume que el endpoint devuelve una lista JSON
          isLoading = false;
        });
      } else {
        setState(() {
          errorMessage = 'Error al obtener datos (${response.statusCode})';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error al conectar con el servidor: $e';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lista de Alergias'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage != null
              ? Center(
                  child: Text(
                    errorMessage!,
                    style: const TextStyle(color: Colors.red),
                  ),
                )
              : ListView.builder(
                  itemCount: alergias.length,
                  itemBuilder: (context, index) {
                    final alergia = alergias[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      child: ListTile(
                        title: Text(
                          alergia['nombre'] ?? 'Nombre no disponible',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          'Síntomas: ${alergia['sintomas'] ?? 'N/A'}\n'
                          'Gravedad: ${alergia['gravedad'] ?? 'Desconocida'}',
                        ),
                        leading: const Icon(Icons.warning_amber_rounded),
                      ),
                    );
                  },
                ),
    );
  }
}
