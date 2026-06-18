<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('name'); //formu dolduranın adı
            $table->string('email'); //formu dolduranın maili
            $table->text('message'); //kullanıcı şikayet mesajı

            //yapay zekanın dolduracağı kısım
            $table->string('category')->nullable(); //ödeme, teknik hata vb.
            $table->string('priority')->nullable(); // düşük, orta, yüksek 

            //talebin sistemdeki durumu
            $table->string('status')->default('pending'); //ilk başta pending olacak
            $table->timestamps(); //oluşturma ve güncelleme alanlarını otomatik ekler   
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
