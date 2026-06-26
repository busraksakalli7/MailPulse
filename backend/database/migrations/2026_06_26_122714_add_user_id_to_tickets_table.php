<?php
// database/migrations/xxxx_add_user_id_to_tickets_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Hangi kullanıcının oluşturduğunu tutuyoruz
            // nullable çünkü eski kayıtlarda bu alan olmayacak
            $table->foreignId('user_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('users')  // users tablosuna bağlı
                  ->nullOnDelete();       // kullanıcı silinirse null olsun
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};