<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ReporteController extends Controller
{
    public function index(Request $request)
    {
        $apiUrl = env('SERVERLESS_API_URL');
        $periodo = $request->get('periodo', 'last-month');

        $metrics = [
            'consultas' => 0,
            'nuevos_pacientes' => 0,
            'hospitalizaciones' => 0,
            'cirugias' => 0,
        ];

        if (!empty($apiUrl)) {
            try {
                $responses = Http::pool(fn ($pool) => [
                    $pool->get("{$apiUrl}/reportes/consultas", ['periodo' => $periodo]),
                    $pool->get("{$apiUrl}/reportes/pacientes-nuevos", ['periodo' => $periodo]),
                    $pool->get("{$apiUrl}/reportes/hospitalizaciones", ['periodo' => $periodo]),
                    $pool->get("{$apiUrl}/reportes/cirugias", ['periodo' => $periodo]),
                ]);

                $metrics['consultas'] = $responses[0]->json('consultas', 0);
                $metrics['nuevos_pacientes'] = $responses[1]->json('nuevos_pacientes', 0);
                $metrics['hospitalizaciones'] = $responses[2]->json('hospitalizaciones', 0);
                $metrics['cirugias'] = $responses[3]->json('cirugias', 0);

            } catch (\Throwable $e) {
                \Log::error('Error al obtener reportes: ' . $e->getMessage());
            }
        }

        return view('reportes', compact('metrics', 'periodo'));
    }

    // 🔹 Descargar CSV (funciona como "Excel" para usuarios)
    public function descargarExcel(Request $request)
    {
        $apiUrl = env('SERVERLESS_API_URL');
        $periodo = $request->get('periodo', 'last-month');

        $metrics = [
            'consultas' => 0,
            'nuevos_pacientes' => 0,
            'hospitalizaciones' => 0,
            'cirugias' => 0,
        ];

        if (!empty($apiUrl)) {
            try {
                $responses = Http::pool(fn ($pool) => [
                    $pool->get("{$apiUrl}/reportes/consultas", ['periodo' => $periodo]),
                    $pool->get("{$apiUrl}/reportes/pacientes-nuevos", ['periodo' => $periodo]),
                    $pool->get("{$apiUrl}/reportes/hospitalizaciones", ['periodo' => $periodo]),
                    $pool->get("{$apiUrl}/reportes/cirugias", ['periodo' => $periodo]),
                ]);

                $metrics['consultas'] = $responses[0]->json('consultas', 0);
                $metrics['nuevos_pacientes'] = $responses[1]->json('nuevos_pacientes', 0);
                $metrics['hospitalizaciones'] = $responses[2]->json('hospitalizaciones', 0);
                $metrics['cirugias'] = $responses[3]->json('cirugias', 0);

            } catch (\Throwable $e) {
                \Log::error('Error al obtener datos para CSV: ' . $e->getMessage());
            }
        }

        $fileName = "reporte_metricas_{$periodo}.csv";
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        $callback = function () use ($periodo, $metrics) {
            $handle = fopen('php://output', 'w');
            // Configurar para Excel en español (evitar problemas con comas)
            fwrite($handle, "\xEF\xBB\xBF"); // BOM para Excel
            fputcsv($handle, ['Periodo', 'Consultas', 'Nuevos Pacientes', 'Hospitalizaciones', 'Cirugías']);
            fputcsv($handle, [
                ucfirst(str_replace('-', ' ', $periodo)),
                $metrics['consultas'],
                $metrics['nuevos_pacientes'],
                $metrics['hospitalizaciones'],
                $metrics['cirugias'],
            ]);
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}