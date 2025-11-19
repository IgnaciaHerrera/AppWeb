<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $apiUrl = env('SERVERLESS_API_URL');

            // Si no hay URL de API configurada, devolver datos de ejemplo para desarrollo
            if (empty($apiUrl)) {
                \Log::warning('SERVERLESS_API_URL no está configurada. Usando datos de ejemplo para el dashboard.');

                $diagnosticosFrecuentes = [
                    ['diagnostico' => 'Gripe', 'total_consultas' => 24],
                    ['diagnostico' => 'Hipertensión', 'total_consultas' => 18],
                    ['diagnostico' => 'Diabetes', 'total_consultas' => 12],
                ];

                $consultasPorMes = [
                    ['mes' => 1, 'nombre_mes' => 'January', 'total_consultas' => 12],
                    ['mes' => 2, 'nombre_mes' => 'February', 'total_consultas' => 18],
                    ['mes' => 3, 'nombre_mes' => 'March', 'total_consultas' => 24],
                    ['mes' => 4, 'nombre_mes' => 'April', 'total_consultas' => 20],
                    ['mes' => 5, 'nombre_mes' => 'May', 'total_consultas' => 26],
                    ['mes' => 6, 'nombre_mes' => 'June', 'total_consultas' => 30],
                ];
            } else {
                // Obtener datos desde la API
                $diagnosticosFrecuentes = $this->getApiData("{$apiUrl}/mas-diagnosticadas");
                $consultasPorMes = $this->getApiData("{$apiUrl}/consultas-por-mes");
            }

            // Ordenar las consultas por número de mes (1 = enero, 12 = diciembre)
            usort($consultasPorMes, function ($a, $b) {
                return $a['mes'] <=> $b['mes'];
            });

            // Traducción de meses al español
            $mesesEspañol = [
                'January' => 'Enero',
                'February' => 'Febrero',
                'March' => 'Marzo',
                'April' => 'Abril',
                'May' => 'Mayo',
                'June' => 'Junio',
                'July' => 'Julio',
                'August' => 'Agosto',
                'September' => 'Septiembre',
                'October' => 'Octubre',
                'November' => 'Noviembre',
                'December' => 'Diciembre'
            ];

            // Log para debugging
            \Log::info('Datos dashboard:', [
                'consultasPorMes' => $consultasPorMes,
                'diagnosticosFrecuentes' => $diagnosticosFrecuentes
            ]);

            // Pasar datos a la vista
            return view('dashboard', [
                'diagnosticosFrecuentes' => $diagnosticosFrecuentes,
                'consultasPorMes' => $consultasPorMes,
                'mesesEspañol' => $mesesEspañol
            ]);

        } catch (\Throwable $e) {
            \Log::error('Error en DashboardController: ' . $e->getMessage());

            return view('dashboard', [
                'diagnosticosFrecuentes' => [],
                'consultasPorMes' => [],
                'mesesEspañol' => []
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

        // Log para debugging
        \Log::info("Datos de {$url}: " . json_encode($data));

        return $data;
    }
}
