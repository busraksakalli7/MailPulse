'use client'; // useAuth hook kullanacağız, client component olmalı

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import FormComponent from './FormComponent';
import TicketList from './TicketList';
import AdminPanel from './AdminPanel';
export default function Home() {
  const router   = useRouter();
  const { user, token, logout, isAdmin, isLoading } = useAuth();

  // Giriş yapılmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // Context yüklenirken veya yönlendirme olurken boş ekran
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  // Ticket gönderme işlemi — artık token da gönderiyoruz
  async function handleSubmitAction(name: string, email: string, message: string) {
    await fetch('http://localhost:8000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`, // <-- kimlik doğrulama için
      },
      body: JSON.stringify({ name, email, message }),
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Üst bar: kullanıcı bilgisi ve çıkış */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">📩 MailPulse</h1>
          <p className="text-sm text-gray-500">
            Hoşgeldin, <strong>{user.name}</strong>
            {/* Role'ü badge olarak göster */}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium
              ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {isAdmin ? '👑 Admin' : '👤 Kullanıcı'}
            </span>
          </p>
        </div>
        <button
          onClick={async () => {
            // Backend'e çıkış isteği at, sonra local state'i temizle
            await fetch('http://localhost:8000/api/logout', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
            });
            logout();
            router.push('/auth');
          }}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-700 transition-colors"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
        {isAdmin ? (
          // Admin paneli — tüm ticket'ları yönetim arayüzüyle gösterir
          <AdminPanel token={token} />
        ) : (
          // Normal kullanıcı paneli — form + kendi ticket'ları
          <>
            <FormComponent onSubmitAction={handleSubmitAction} />
            <TicketList token={token} />
          </>
        )}
      </div>
    </main>
  );
}