<?php

namespace App\Http\Controllers;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Jobs\ProcessTicketAi;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        // 1. Gelen verileri doğrula
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // 2. Veritabanına kaydet
        $ticket = Ticket::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'message' => $validatedData['message'],
            'status' => 'pending',
        ]);

        ProcessTicketAI::dispatch($ticket);
        
        // next.js'e başarı cevabı dön
        return response()->json([
            'message' => 'Destek talebiniz başarıyla alındı. Yapay zeka analiz ediyor...',
            'data' => $ticket
        ], 201); // 201 HTTP kodu oluşturuldu anlamına gelir.
    }
        // Tüm ticket'ları veritabanından çekip dışarıya JSON olarak döner
        public function index()
        {
            // Veritabanındaki tüm ticket'ları en son yüklenenden (en yeni) başlayarak çekiyoruz
            $tickets = Ticket::latest()->get();

            // Next.js'e bu listeyi JSON formatında teslim ediyoruz
            return response()->json($tickets, 200);
        }
}
