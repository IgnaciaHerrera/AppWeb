import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MedicamentosPage extends StatefulWidget {
  const MedicamentosPage({super.key});

  @override
  State<MedicamentosPage> createState() => _MedicamentosPageState();
}

class _MedicamentosPageState extends State<MedicamentosPage> {
  List<dynamic> medicamentos = [];
  bool isLoading = true;
  String? errorMessage;

  // 👇 Cambia este link por tu endpoint real
  final String apiUrl = 'https://clc8mu24re.execute-api.us-east-1.amazonaws.com/alergias';
  @override
  void initState() {
    super.initState();
    fetchMedicamentos();
  }

  Future<void> fetchMedicamentos() async {
    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        setState(() {
          medicamentos = data; // asume que el endpoint devuelve una lista JSON
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
        title: const Text('Lista de Medicamentos'),
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
                  itemCount: medicamentos.length,
                  itemBuilder: (context, index) {
                    final med = medicamentos[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      child: ListTile(
                        title: Text(
                          med['nombre'] ?? 'Nombre no disponible',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          'Dosis: ${med['dosis'] ?? 'N/A'}\n'
                          'Tipo: ${med['tipo'] ?? 'Desconocido'}',
                        ),
                        leading: const Icon(Icons.medication_outlined),
                      ),
                    );
                  },
                ),
    );
  }
}
