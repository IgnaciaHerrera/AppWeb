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