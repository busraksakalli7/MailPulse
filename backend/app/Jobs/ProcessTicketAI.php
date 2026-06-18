<?php

namespace App\Jobs;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class ProcessTicketAI implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $ticket;
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function handle(): void
    {
        try {
            $this->ticket->update(['status' => 'processing']);

            $prompt = "Sana bir kullanıcının destek talebi mesajını göndereceğim. 
            Bu mesajı analiz et ve SADECE aşağıdaki JSON formatında cevap dön. 
            Başka hiçbir açıklama, giriş veya sonuç cümlesi yazma. Sadece saf JSON dön.

            Kategoriler: 'Ödeme', 'Teknik Hata', 'Genel'
            Aciliyet Durumları: 'Düşük', 'Orta', 'Yüksek'

            Format:
            {
            \"category\": \"kategori_buraya\",
            \"priority\": \"aciliyet_buraya\"
            }

            Kullanıcı Mesajı: \"" . $this->ticket->message . "\"";
            // Ollama'ya istek atıyoruz.
            $ollamaResponse = Http::timeout(120)->post('http://127.0.0.1:11434/api/generate', [
                'model' => 'qwen3:8b', 
                'prompt' => $prompt,
                'stream' => false,
                'format' => 'json',
                'options' => [
                'temperature' => 0.0
            ]
            ]);

           $aiResponse = $ollamaResponse->json('response');
            logger('Yapay Zeka Analiz Sonucu: ' . $aiResponse);

            // json_decode metni PHP dizisine çevirir. true parametresi array olmasını sağlar.
            $resultData = json_decode($aiResponse, true);

            // Eğer json_decode başarılı olduysa ve içindeki alanlar doluysa veritabanını güncelle
            if (isset($resultData['category']) && isset($resultData['priority'])) {
                $this->ticket->update([
                    'category' => $resultData['category'],
                    'priority' => $resultData['priority'],
                    'status' => 'completed' // Durumu başarıyla tamamlandı yapıyoruz
                ]);
                logger('Ticket ID ' . $this->ticket->id . ' başarıyla yapay zeka verileriyle güncellendi.');
            } else {
                // Eğer yapay zeka formatı bozduysa durumu hata olarak işaretle
                $this->ticket->update(['status' => 'failed']);
                logger('Yapay zeka geçersiz JSON formatı döndü.');
            }

        } catch (\Exception $e) {
            logger('Kuyrukta Ollama Hatası: ' . $e->getMessage());
            $this->ticket->update(['status' => 'failed']);
        }
            }
        }
