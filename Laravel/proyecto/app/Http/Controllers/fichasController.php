<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class fichasController extends Controller
{
    public function index()
    {
        try {
            $apiUrl = env('SERVERLESS_API_URL');

            if (empty($apiUrl)) {
                \Log::warning('SERVERLESS_API_URL no está configurada. Usando datos de ejemplo para fichas médicas.');

                // Datos de ejemplo (simulando respuesta de la API)
                $pacientes = [
                    [
                        'id' => 1,
                        'nombre' => 'Maria Elena González',
                        'apellido' => 'González',
                        'email' => 'maria.gonzalez@email.com',
                        'telefono' => '+56 9 1234 5678',
                        'edad' => 45,
                        'tipo_sanguineo' => 'O+',
                        'ultima_consulta' => '2024-06-15',
                        'estado' => 'Activo'
                    ],
                    [
                        'id' => 2,
                        'nombre' => 'Juan Carlos Pérez',
                        'apellido' => 'Pérez',
                        'email' => 'juan.perez@gmail.com',
                        'telefono' => '+56 9 6765 4321',
                        'edad' => 38,
                        'tipo_sanguineo' => 'A+',
                        'ultima_consulta' => '2024-06-14',
                        'estado' => 'Hospitalizado'
                    ],
                    [
                        'id' => 3,
                        'nombre' => 'Ana Sofía Martínez',
                        'apellido' => 'Martínez',
                        'email' => 'ana.martinez@gmail.com',
                        'telefono' => '+56 9 1122 3344',
                        'edad' => 28,
                        'tipo_sanguineo' => 'B+',
                        'ultima_consulta' => '2024-06-13',
                        'estado' => 'Activo'
                    ]
                ];
            } else {
                // Aquí debes obtener el ID del médico logueado.
                // En este ejemplo, asumimos que el Dr. Carlos Mendoza tiene ID=1.
                // En un sistema real, esto vendría de la sesión o autenticación.
                $medicoId = 1; // ⚠️ Cambiar esto por el ID real del médico logueado

                $url = "{$apiUrl}/pacientes-por-medico/{$medicoId}";
                $pacientes = $this->getApiData($url);
            }

            \Log::info('Datos de fichas médicas:', ['pacientes' => $pacientes]);

            return view('fichas', [
                'pacientes' => $pacientes
            ]);

        } catch (\Throwable $e) {
            \Log::error('Error en FichaMedicaController: ' . $e->getMessage());

            return view('fichas', [
                'pacientes' => []
            ])->withErrors(['api_error' => $e->getMessage()]);
        }
    }

    public function show($id)
{
    try {
        $apiUrl = env('SERVERLESS_API_URL');

        if (empty($apiUrl)) {
            // ... datos de ejemplo ...
        } else {
            $url = "{$apiUrl}/ficha-completa/{$id}";
            $response = Http::timeout(30)->get($url);

            if ($response->failed()) {
                throw new \Exception("Error al consultar: {$url} - Status: " . $response->status());
            }

            $data = $response->json();

            $paciente = $data['paciente'] ?? [];
            $consultas = $data['consultas'] ?? [];
            $medicamentos = $data['medicamentos'] ?? [];
            $hospitalizaciones = $data['hospitalizaciones'] ?? [];
            $cirugias = $data['cirugias'] ?? [];
            $alergias = $data['alergias'] ?? [];
            $recetas = $data['recetas'] ?? [];
            
            // 🔑 Agrupar exámenes por idExamen
            $examenesRaw = $data['examenes'] ?? [];
            $examenes = [];
            
            foreach ($examenesRaw as $examen) {
                $examId = $examen['idExamen'];
                
                // Si es la primera vez que vemos este examen, creamos la estructura base
                if (!isset($examenes[$examId])) {
                    $examenes[$examId] = [
                        'idExamen' => $examen['idExamen'],
                        'nombre' => $examen['nombre'],
                        'procedimiento' => $examen['procedimiento'],
                        'tratamiento' => $examen['tratamiento'],
                        'detalles' => []
                    ];
                }
                
                // Añadimos el detalle del examen
                $examenes[$examId]['detalles'][] = [
                    'dato' => $examen['dato_nombre'],
                    'valor' => $examen['valor'],
                    'unidad' => $examen['unidad'],
                    'rango_referencia' => $examen['vrReferencia']
                ];
            }
            
            // Convertimos a array indexado
            $examenes = array_values($examenes);
        }

        return view('ficha-detalle', compact(
            'paciente',
            'consultas',
            'medicamentos',
            'examenes',
            'hospitalizaciones',
            'cirugias',
            'alergias',
            'recetas'
        ));

    } catch (\Throwable $e) {
        \Log::error('Error en FichaMedicaController@show: ' . $e->getMessage());
        return redirect()->route('fichas.index')->withErrors(['api_error' => $e->getMessage()]);
    }
}

public function edit($id)
{
    try {
        $apiUrl = env('SERVERLESS_API_URL');

        if (empty($apiUrl)) {
            // Datos de ejemplo
            $paciente = [
                'id' => $id,
                'nombre' => 'María Elena González',
                'apellido' => 'González',
                'email' => 'maria.gonzalez@email.com',
                'telefono' => '+56 9 1234 5678',
                'edad' => 45,
                'tipo_sanguineo' => 'O+',
                'ultima_consulta' => '2024-06-15',
                'estado' => 'Activo'
            ];

            $consulta = [
                'fecha' => '2024-06-15',
                'tipo_consulta' => 'consulta_rutinaria',
                'medico_id' => 1,
                'tratamiento' => 'Control de presión arterial y dieta baja en sodio.'
            ];

            $diagnostico = 'Hipertensión arterial leve';

            $medicamentos = [
                ['nombre' => 'Losartán', 'dosis' => '50mg diarios'],
                ['nombre' => 'Metformina', 'dosis' => '850mg cada 12 horas']
            ];

            $examenes = [
                ['nombre' => 'Electrocardiograma', 'procedimiento' => 'Registro eléctrico del corazón'],
                ['nombre' => 'Glucosa en sangre', 'procedimiento' => 'Análisis de nivel de azúcar']
            ];
        } else {
            $url = "{$apiUrl}/ficha-completa/{$id}";
            $response = Http::timeout(30)->get($url);

            if ($response->failed()) {
                throw new \Exception("Error al consultar: {$url} - Status: " . $response->status());
            }

            $data = $response->json();

            $paciente = $data['paciente'] ?? [];
            
            // 🔑 Obtener la última consulta (asumiendo que 'consultas' es un array ordenado)
            $consultas = $data['consultas'] ?? [];
            $consulta = !empty($consultas) ? $consultas[0] : [
                'fecha' => now()->format('Y-m-d'),
                'tipo_consulta' => '',
                'medico_id' => 1,
                'tratamiento' => ''
            ];

            // 🔑 Extraer el diagnóstico
            $diagnostico = $data['diagnostico'] ?? ''; // Ajusta si tu API lo devuelve en otro lugar

            $medicamentos = $data['medicamentos'] ?? [];
            $examenes = $data['examenes'] ?? [];

            // Procesar exámenes (como ya haces)
            $examenesRaw = $data['examenes'] ?? [];
            $examenes = [];
            foreach ($examenesRaw as $examen) {
                $examId = $examen['idExamen'];
                if (!isset($examenes[$examId])) {
                    $examenes[$examId] = [
                        'idExamen' => $examen['idExamen'],
                        'nombre' => $examen['nombre'],
                        'procedimiento' => $examen['procedimiento'],
                        'tratamiento' => $examen['tratamiento'],
                        'detalles' => []
                    ];
                }
                $examenes[$examId]['detalles'][] = [
                    'dato' => $examen['dato_nombre'],
                    'valor' => $examen['valor'],
                    'unidad' => $examen['unidad'],
                    'rango_referencia' => $examen['vrReferencia']
                ];
            }
            $examenes = array_values($examenes);
        }

        // ✅ PASA TODAS LAS VARIABLES NECESARIAS
        return view('ficha-edit', compact(
            'paciente',
            'consulta',      // ← Añadido
            'diagnostico',   // ← Añadido
            'medicamentos',
            'examenes'
        ));

    } catch (\Throwable $e) {
        \Log::error('Error en FichaMedicaController@edit: ' . $e->getMessage());
        return redirect()->route('fichas.index')->withErrors(['api_error' => $e->getMessage()]);
    }
}

    public function destroy($id)
    {
        // Lógica para eliminar una ficha
        return response()->json(['message' => "Eliminando ficha del paciente ID: $id"]);
    }
    public function update(Request $request, $id)
{
    try {
        // Validación básica (ajusta según tus reglas)
        $request->validate([
            'paciente.nombre' => 'required|string|max:100',
            'paciente.apellido' => 'required|string|max:100',
            'paciente.email' => 'nullable|email|max:100',
            'paciente.telefono' => 'nullable|string|max:15',
            'paciente.edad' => 'required|integer|min:0|max:150',
            'fecha_consulta' => 'required|date',
            'tipo_consulta' => 'required|string',
            'medico_tratante' => 'required|integer',
            'diagnostico' => 'nullable|string',
            'plan_tratamiento' => 'nullable|string',
            'medicamentos' => 'nullable|array',
            'dosis' => 'nullable|array',
            'medicamentos.*' => 'nullable|string|max:200',
            'dosis.*' => 'nullable|string|max:100',
        ]);

        $apiUrl = env('SERVERLESS_API_URL');

        if (empty($apiUrl)) {
            \Log::warning('SERVERLESS_API_URL no está configurada. Simulando actualización.');
            // Simular éxito
            return redirect()->route('fichas.show', $id)->with('success', 'Ficha médica actualizada correctamente (modo simulado).');
        }

        // 📦 Estructurar los datos en el formato esperado por tu API
        $data = [
            'paciente' => [
                'nombre' => $request->input('paciente.nombre'),
                'apellido' => $request->input('paciente.apellido'),
                'email' => $request->input('paciente.email'),
                'telefono' => $request->input('paciente.telefono'),
                'edad' => $request->input('paciente.edad'),
            ],
            'fecha_consulta' => $request->input('fecha_consulta'),
            'tipo_consulta' => $request->input('tipo_consulta'),
            'medico_tratante' => $request->input('medico_tratante'),
            'diagnostico' => $request->input('diagnostico'),
            'plan_tratamiento' => $request->input('plan_tratamiento'),
            'medicamentos' => $request->input('medicamentos', []),
            'dosis' => $request->input('dosis', []),
        ];

        $url = "{$apiUrl}/ficha/{$id}";
        $response = Http::timeout(30)->put($url, $data);

        if ($response->failed()) {
            // Intentar extraer mensaje de error de la API
            $errorBody = $response->json();
            $errorMessage = $errorBody['message'] ?? $response->status();
            throw new \Exception("Error al actualizar: {$errorMessage}");
        }

        return redirect()->route('fichas.show', $id)->with('success', 'Ficha médica actualizada correctamente.');

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Errores de validación: regresar con errores al formulario
        return redirect()->route('fichas.edit', $id)->withErrors($e->errors())->withInput();

    } catch (\Throwable $e) {
        \Log::error('Error en FichaMedicaController@update: ' . $e->getMessage(), [
            'request_data' => $request->all(),
            'exception' => $e
        ]);

        $errorMessage = $e->getMessage();
        // Mostrar solo mensaje amigable al usuario (no detalles técnicos)
        if (str_contains($errorMessage, 'Error al actualizar')) {
            $userMessage = 'No se pudo actualizar la ficha médica. Por favor, inténtalo de nuevo.';
        } else {
            $userMessage = 'Ocurrió un error inesperado. Contacta al administrador.';
        }

        return redirect()->route('fichas.edit', $id)->withErrors(['api_error' => $userMessage]);
    }
}
    private function getApiData($url)
    {
        $response = Http::timeout(30)->get($url);

        if ($response->failed()) {
            throw new \Exception("Error al consultar: {$url} - Status: " . $response->status());
        }

        $data = $response->json() ?? [];

        \Log::info("Datos de {$url}: " . json_encode($data));

        return $data;
    }
}