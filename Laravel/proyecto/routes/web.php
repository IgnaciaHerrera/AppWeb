<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlergiaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\fichasController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reportes', function () {
    return view('reportes');
});

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/fichas', [fichasController::class, 'index'])->name('fichas.index');
