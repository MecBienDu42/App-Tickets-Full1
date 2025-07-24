<?php

use App\Http\Controllers\AuthentificationController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AgencyController;
use App\Http\Controllers\StatisticsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/tickets/position', [TicketController::class, 'checkPosition']);

// Authentication routes (public)
Route::post('login', [AuthentificationController::class, 'login']);
Route::post('register', [AuthentificationController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Statistics
    Route::get('/statistics', [StatisticsController::class, 'index']);
    
    // Agencies management
    Route::get('/agencies', [AgencyController::class, 'index']);
    Route::post('/agencies', [AgencyController::class, 'store']);
    Route::put('/agencies/{id}', [AgencyController::class, 'update']);
    Route::delete('/agencies/{id}', [AgencyController::class, 'destroy']);
    
    // Agents management
    Route::get('/agents', [AgentController::class, 'index']);
    Route::post('/agents', [AgentController::class, 'store']);
    Route::apiResource('agents', AgentController::class)->except(['index', 'store']);
    
    // Tickets management
    Route::get('/tickets/queue', [TicketController::class, 'queue']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/tickets/{id}/cancel', [TicketController::class, 'cancel']);
    Route::post('/tickets/{id}/use', [TicketController::class, 'markAsUsed']);

    // User profile routes
    Route::get('/user/profile', [AuthentificationController::class, 'profile']);
    Route::put('/user/profile', [AuthentificationController::class, 'updateProfile']);

    Route::post('/tickets/call-next', [TicketController::class, 'callNext']);
    Route::post('/tickets/{id}/assign', [TicketController::class, 'assign']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets/cancel-by-number', [TicketController::class, 'cancelByNumber']);
    
    // Geolocation
    Route::post('/calculate-travel-time', [TicketController::class, 'calculateTravelTime']);
    
    // Logout
    Route::post('logout', [AuthentificationController::class, 'deconnexion'])->name('logout');
});
