<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{

    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // toplu atama için
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Kullanıcı admin mi?
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Kullanıcının ticket'larına erişmek için ilişki (1 user -> çok ticket)
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}