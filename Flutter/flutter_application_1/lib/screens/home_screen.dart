// lib/screens/home_screen.dart

/* import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/extinct_animal.dart';
import '../services/extinct_api_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ExtinctApiService _api = ExtinctApiService();
  late Future<ExtinctAnimal> _future;

  @override
  void initState() {
    super.initState();
    _future = _api.fetchRandomAnimal();
  }

  void _reload() {
    setState(() {
      _future = _api.fetchRandomAnimal();
    });
  }

  // Abre el enlace en el navegador
  Future<void> _launchURL(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw Exception('No se pudo abrir el enlace: $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Extinct Animals'),
        backgroundColor: Colors.deepOrange[400],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            tooltip: 'Otro animal',
            icon: const Icon(Icons.refresh),
            onPressed: _reload,
          ),
        ],
      ),
      body: FutureBuilder<ExtinctAnimal>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 12),
                    Text(
                      'Ocurrió un error',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: _reload,
                      child: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            );
          }

          final animal = snapshot.data!;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Card(
              color: Colors.orange[50],
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              clipBehavior: Clip.antiAlias,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Imagen superior
                  if (animal.imageSrc.isNotEmpty)
                    AspectRatio(
                      aspectRatio: 16 / 9,
                      child: Image.network(
                        animal.imageSrc,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Center(
                          child: Padding(
                            padding: EdgeInsets.all(24),
                            child: Text('Imagen no disponible'),
                          ),
                        ),
                      ),
                    ),

                  // Contenido textual
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          animal.commonName,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          animal.binomialName,
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(color: Colors.grey[700]),
                        ),
                        const SizedBox(height: 8),
                        Text('Último registro: ${animal.lastRecord}'),
                        Text('Ubicación: ${animal.location}'),
                        const SizedBox(height: 12),
                        Text(
                          animal.shortDesc,
                          textAlign: TextAlign.justify,
                          style: const TextStyle(height: 1.4),
                        ),
                        const SizedBox(height: 12),

                        // Enlace a Wikipedia (solo si existe)
                        if (animal.wikiLink.isNotEmpty)
                          TextButton.icon(
                            onPressed: () => _launchURL(animal.wikiLink),
                            icon: const Icon(Icons.link),
                            label: const Text('Ver en Wikipedia'),
                            style: TextButton.styleFrom(
                              foregroundColor: Colors.blue[700],
                            ),
                          ),

                        const SizedBox(height: 8),
                        Align(
                          alignment: Alignment.centerRight,
                          child: OutlinedButton.icon(
                            onPressed: _reload,
                            icon: const Icon(Icons.casino),
                            label: const Text('Otro aleatorio'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

*/