<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AlergiaController extends Controller
{
    public function index()
    {
        try {
            // URL desde .env
            $apiUrl = env('SERVERLESS_API_URL') . '/alergias';
            
            // Llama a tu API Serverless
            $response = Http::get($apiUrl);

            if ($response->failed()) {
                throw new \Exception('Error al consultar la API: ' . $response->status());
            }

            // Decodifica el JSON
            $alergias = $response->json();

            // Retorna tu vista "alergia.blade.php"
            return view('alergia', compact('alergias'));

        } catch (\Throwable $e) {
            // Si falla, muestra el error en la vista
            return view('alergia')->withErrors([
                'api_error' => $e->getMessage(),
            ]);
        }
    }
}