<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlergiaController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/medico', function () {
    return view('medico');
});

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/alergia', [AlergiaController::class, 'index']);
