<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;

// ===== AÇIK ROTALAR (giriş gerektirmez) =====
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ===== KORUNAN ROTALAR (Sanctum token gerekir) =====
// Bu group'a giren her route için token kontrolü yapılır
Route::middleware('auth:sanctum')->group(function () {

    // Kullanıcı işlemleri
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Ticket işlemleri
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets',  [TicketController::class, 'index']);
});