<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TicketController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//kaydetme işlemi için route 
Route::post('/tickets', [TicketController::class, 'store']);

// Dışarıdan biri /api/tickets adresine GET isteği atarsa verileri listele
Route::get('/tickets', [TicketController::class, 'index']);

