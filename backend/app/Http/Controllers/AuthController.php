<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Yeni kullanıcı kaydı
     * POST /api/register
     */
    public function register(Request $request)
    {
        // Gelen veriyi doğrula
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email', // email benzersiz olmalı
            'password' => 'required|string|min:6|confirmed',   // password_confirmation ile eşleşmeli
        ]);

        // Kullanıcıyı oluştur, rol her zaman 'user' olarak başlar
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']), // şifreyi hashle
            'role'     => 'user', // yeni kayıtlar daima normal kullanıcı
        ]);

        // Sanctum ile token üret
        // "auth_token" token'ın ismi — istediğimizi yazabiliriz
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Kullanıcı girişi
     * POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Email/şifre yanlışsa hata fırlat
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['E-posta veya şifre hatalı.'],
            ]);
        }

        // Giriş başarılı, kullanıcıyı getir
        $user = Auth::user();

        // Eski token'ları sil (her girişte temiz slate)
        $user->tokens()->delete();

        // Yeni token oluştur
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,  // frontend role bilgisini buradan alacak
            'token' => $token,
        ]);
    }

    /**
     * Çıkış yap
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Sadece mevcut token'ı sil
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Çıkış yapıldı.']);
    }

    /**
     * Giriş yapmış kullanıcı bilgisi
     * GET /api/me
     */
    public function me(Request $request)
    {
        // auth middleware sayesinde $request->user() dolu gelir
        return response()->json($request->user());
    }
}