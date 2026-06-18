<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    // Laravel'in toplu veri kaydetmesine izin verdiği güvenli alanlar listesi
    protected $fillable = [
        'name',
        'email',
        'message',
        'category',
        'priority',
        'status'
    ];
}