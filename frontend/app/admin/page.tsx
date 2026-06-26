'use client';

import { useEffect, useState } from 'react';
import AdminPanel from '@/app/AdminPanel';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tarayıcı yüklendiğinde hafızadaki gerçek token'ı çekiyoruz
    const savedToken = localStorage.getItem('auth_token');
    setToken(savedToken);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600 text-center font-medium">Yetki kontrol ediliyor...</div>;
  }

  // Hafızada token yoksa kapıdaki kilidi gösteriyoruz
  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-amber-600 bg-amber-50 rounded-xl border border-amber-200 text-center shadow-sm">
        🔒 Lütfen önce admin hesabınızla giriş yapın.
      </div>
    );
  }

  // Jeton varsa akıllı admin paneli tablosunu ekrana basıyoruz
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <AdminPanel token={token} />
    </main>
  );
}