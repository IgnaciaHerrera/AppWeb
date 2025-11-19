import 'package:flutter/material.dart';

class PerfilPage extends StatelessWidget {
  const PerfilPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text('Perfil del Médico'),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black87,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Center(
              child: CircleAvatar(
                radius: 50,
                backgroundColor: Color(0xFFE6F0FA),
                child: Icon(Icons.person, size: 60, color: Colors.black54),
              ),
            ),
            SizedBox(height: 20),
            Text('Nombre: Dr. Benjamín Soto', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Especialidad: Medicina General', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Correo: ben.soto@clinicudd.cl', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Teléfono: +56 9 1234 5678', style: TextStyle(fontSize: 16)),
            SizedBox(height: 20),
            Divider(),
            Text(
              'Información adicional',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              'Puedes editar esta sección más adelante para mostrar detalles del médico, su experiencia, o configuraciones personales.',
              style: TextStyle(color: Colors.black54),
            ),
          ],
        ),
      ),
    );
  }
}
