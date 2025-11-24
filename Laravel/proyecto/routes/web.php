<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\fichasController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ProfileController;

// Rutas protegidas por autenticación
Route::middleware('auth')->group(function () {
    // Ruta raíz: muestra welcome.blade.php (solo para usuarios logueados)
    Route::get('/', function () {
        return view('welcome');
    })->name('welcome');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Fichas médicas
    Route::get('/fichas', [fichasController::class, 'index'])->name('fichas.index');
    Route::get('/fichas/{id}', [fichasController::class, 'show'])->name('fichas.show');
    Route::get('/fichas/{id}/edit', [fichasController::class, 'edit'])->name('fichas.edit');
    Route::put('/fichas/{id}', [fichasController::class, 'update'])->name('fichas.update');
    Route::delete('/fichas/{id}', [fichasController::class, 'destroy'])->name('fichas.destroy');

    // Reportes
    Route::get('/reportes', [ReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/export/excel', [ReporteController::class, 'descargarExcel'])->name('reportes.export.excel');

    // Perfil (Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de autenticación (login, register, etc.)
require __DIR__.'/auth.php';