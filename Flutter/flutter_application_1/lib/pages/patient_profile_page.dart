import 'package:flutter/material.dart';
import '../services/alergias_service.dart';

import '../models/patient.dart';
import '../widgets/info_card.dart';
import '../widgets/section_card.dart';
import '../widgets/expandable_section.dart';

class PatientProfilePage extends StatefulWidget {
  final Patient patient;

  const PatientProfilePage({super.key, required this.patient});

  @override
  State<PatientProfilePage> createState() => _PatientProfilePageState();
}

class _PatientProfilePageState extends State<PatientProfilePage> {
  late Future<List<Map<String, dynamic>>> _alergiasFuture;

  @override
  void initState() {
    super.initState();
    _reloadAlergias();
  }

  void _reloadAlergias() {
    _alergiasFuture = AlergiasService.fetchAllAlergias();
  }

  Future<void> _confirmDelete(BuildContext context, String id, String nombre) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirmar eliminación'),
        content: Text('¿Eliminar la alergia "$nombre"? Esta acción no se puede deshacer.'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancelar')),
          TextButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Eliminar', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (ok == true) {
      try {
        await AlergiasService.deleteAlergia(id);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alergia eliminada')));
        setState(() { _reloadAlergias(); });
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error eliminando: $e')));
      }
    }
  }

  Future<void> _showEditDialog(BuildContext context, String id, String currentNombre) async {
    final nombreCtrl = TextEditingController(text: currentNombre);
    final descCtrl = TextEditingController();

    final result = await showDialog<Map<String, String>?>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Editar alergia'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nombreCtrl, decoration: const InputDecoration(labelText: 'Nombre')),
            const SizedBox(height: 8),
            TextField(controller: descCtrl, decoration: const InputDecoration(labelText: 'Descripción')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(null), child: const Text('Cancelar')),
          TextButton(onPressed: () => Navigator.of(ctx).pop({'nombre': nombreCtrl.text.trim(), 'descripcion': descCtrl.text.trim()}), child: const Text('Guardar')),
        ],
      ),
    );

    if (result != null && (result['nombre']?.isNotEmpty == true) && (result['descripcion']?.isNotEmpty == true)) {
      try {
        await AlergiasService.updateAlergia(id, {'nombre': result['nombre'], 'descripcion': result['descripcion']});
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alergia actualizada')));
        setState(() { _reloadAlergias(); });
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error actualizando: $e')));
      }
    } else if (result != null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Nombre y descripción son requeridos')));
    }
  }

  Future<void> _showAddDialog(BuildContext context) async {
    final nombreCtrl = TextEditingController();
    final descCtrl = TextEditingController();

    final result = await showDialog<Map<String, String>?>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Agregar alergia'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nombreCtrl, decoration: const InputDecoration(labelText: 'Nombre')),
            const SizedBox(height: 8),
            TextField(controller: descCtrl, decoration: const InputDecoration(labelText: 'Descripción')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(null), child: const Text('Cancelar')),
          TextButton(onPressed: () => Navigator.of(ctx).pop({'nombre': nombreCtrl.text.trim(), 'descripcion': descCtrl.text.trim()}), child: const Text('Crear')),
        ],
      ),
    );

    if (result != null && (result['nombre']?.isNotEmpty == true) && (result['descripcion']?.isNotEmpty == true)) {
      try {
        await AlergiasService.createAlergia({'nombre': result['nombre'], 'descripcion': result['descripcion']});
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alergia creada')));
        setState(() { _reloadAlergias(); });
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error creando: $e')));
      }
    } else if (result != null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Nombre y descripción son requeridos')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text('Perfil del Paciente'),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black87,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // --- Encabezado del paciente ---
            Card(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              elevation: 1,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 28,
                      backgroundColor: Color(0xFFE6F0FA),
                      child: Icon(Icons.person,
                          size: 36, color: Colors.black54),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
              Text(widget.patient.name,
                              style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
              Text('RUT: ${widget.patient.rut}',
                              style:
                                  const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // --- Edad y tipo sanguíneo ---
            Row(
              children: [
                Expanded(
                  child: InfoCard(
                      title: 'EDAD',
                      value: '${widget.patient.age} años',
                      icon: Icons.cake),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: InfoCard(
                      title: 'TIPO SANGUÍNEO',
                      value: widget.patient.bloodType,
                      icon: Icons.bloodtype),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // --- Contacto de emergencia ---
            SectionCard(
              color: Colors.red.shade100,
              icon: Icons.phone,
              title: 'Contacto de emergencia',
              subtitle: 'Carlos Rodríguez\n+56 9 7654 3210',
            ),

            // --- Alergias (desde endpoint AWS) ---
            FutureBuilder<List<Map<String, dynamic>>>(
              future: _alergiasFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Card(
                    child: ListTile(
                      leading: CircularProgressIndicator(),
                      title: Text('Cargando alergias...'),
                    ),
                  );
                } else if (snapshot.hasError) {
                  return Card(
                    child: ListTile(
                      leading:
                          const Icon(Icons.error, color: Colors.red),
                      title: const Text('Error al cargar las alergias'),
                      subtitle: Text(snapshot.error.toString()),
                    ),
                  );
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Card(
                    child: ListTile(
                      leading: Icon(Icons.info_outline),
                      title: Text('Sin alergias registradas'),
                    ),
                  );
                } else {
                  final items = snapshot.data!;
                  return Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 1,
                    child: ExpansionTile(
                      leading: CircleAvatar(backgroundColor: Colors.orange.shade100, child: const Icon(Icons.warning_amber_rounded, color: Colors.black87)),
                      title: const Text('Alergias', style: TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('${items.length} alergias registradas'),
                      children: items.map((item) {
                        final nombre = (item['nombre'] ?? item['name'] ?? item['nombreAlergia'] ?? item.toString()).toString();
                        final idVal = item['id'] ?? item['idAlergia'] ?? item['_id'] ?? item['idA'];
                        final id = idVal != null ? idVal.toString() : nombre;
                        return ListTile(
                          title: Text(nombre),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.edit, color: Colors.blue),
                                onPressed: () => _showEditDialog(context, id, nombre),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete, color: Colors.red),
                                onPressed: () => _confirmDelete(context, id, nombre),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  );
                }
              },
            ),

            // --- Condiciones médicas ---
            ExpandableSection(
              color: Colors.green.shade100,
              icon: Icons.monitor_heart,
              title: 'Condiciones médicas',
              subtitle: '2 condiciones',
              items: const ['Diabetes tipo 2', 'Hipertensión'],
            ),

            // --- Medicamentos ---
            ExpandableSection(
              color: Colors.purple.shade100,
              icon: Icons.medication,
              title: 'Medicamentos actuales',
              subtitle: '2 medicamentos',
              items: const ['Metformina 850mg', 'Losartán 50mg'],
            ),

            // --- Última consulta ---
            SectionCard(
              color: Colors.teal.shade100,
              icon: Icons.calendar_today,
              title: 'Última consulta',
              subtitle: '16 de octubre de 2025\nControl de diabetes',
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context),
        child: const Icon(Icons.add),
        tooltip: 'Agregar alergia',
      ),
    );
  }
}
