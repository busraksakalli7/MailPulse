<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Jobs\ProcessTicketAI;

class TicketController extends Controller
{
    /**
     * Ticket oluştur
     * POST /api/tickets
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'user_id' => $request->user()->id, // giriş yapmış kullanıcının id'si
            'name'    => $validatedData['name'],
            'email'   => $validatedData['email'],
            'message' => $validatedData['message'],
            'status'  => 'pending',
        ]);

        ProcessTicketAI::dispatch($ticket);

        return response()->json([
            'message' => 'Destek talebiniz alındı, analiz ediliyor...',
            'data'    => $ticket
        ], 201);
    }

    /**
     * Ticket listesi
     * GET /api/tickets
     *
     * Admin: tüm ticket'ları görür
     * Normal kullanıcı: sadece kendi ticket'larını görür
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            // Admin her şeyi görsün, kim oluşturdu bilgisiyle
            $tickets = Ticket::with('user:id,name,email,role')
                             ->latest()
                             ->get();
        } else {
            // Normal kullanıcı sadece kendinkini görsün
            $tickets = Ticket::where('user_id', $user->id)
                             ->latest()
                             ->get();
        }

        return response()->json($tickets);
    }
}