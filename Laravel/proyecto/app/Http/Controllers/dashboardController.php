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

            $metrics = [
                'pacientes_atendidos_30d' => 3,
                'pacientes_activos' => 13,
                'hospitalizaciones' => 10,
            ];
        } else {
            $diagnosticosFrecuentes = $this->getApiData("{$apiUrl}/mas-diagnosticadas");
            $consultasPorMes = $this->getApiData("{$apiUrl}/consultas-por-mes");

            // Nuevas métricas
            $pacientes30d = $this->getApiData("{$apiUrl}/pacientes-atendidos-30d");
            $totalPacientes = $this->getApiData("{$apiUrl}/total-pacientes");
            $hospitalizaciones = $this->getApiData("{$apiUrl}/total-hospitalizaciones");

            $metrics = [
                'pacientes_atendidos_30d' => $pacientes30d['total_pacientes_atendidos_30d'] ?? 0,
                'pacientes_activos' => $totalPacientes['total_pacientes_activos'] ?? 0,
                'hospitalizaciones' => $hospitalizaciones['total_hospitalizaciones'] ?? 0,
            ];
        }

        usort($consultasPorMes, function ($a, $b) {
            return $a['mes'] <=> $b['mes'];
        });

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

        \Log::info('Datos dashboard:', [
            'consultasPorMes' => $consultasPorMes,
            'diagnosticosFrecuentes' => $diagnosticosFrecuentes,
            'metrics' => $metrics
        ]);

        return view('dashboard', [
            'diagnosticosFrecuentes' => $diagnosticosFrecuentes,
            'consultasPorMes' => $consultasPorMes,
            'mesesEspañol' => $mesesEspañol,
            'metrics' => $metrics, // <-- IMPORTANTE: pasar metrics a la vista
        ]);

    } catch (\Throwable $e) {
        \Log::error('Error en DashboardController: ' . $e->getMessage());

        return view('dashboard', [
            'diagnosticosFrecuentes' => [],
            'consultasPorMes' => [],
            'mesesEspañol' => [],
            'metrics' => [
                'pacientes_atendidos_30d' => 0,
                'pacientes_activos' => 0,
                'hospitalizaciones' => 0,
            ]
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
