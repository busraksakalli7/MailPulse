'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  // 'login' veya 'register' modunu tutuyoruz
  const [mode, setMode]         = useState<'login' | 'register'>('login');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Form alanlarının state'i
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Input değişince state'i güncelle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/login' : '/api/register';

    // Gönderilecek veri: login'de sadece email+password yeterli
    const body = mode === 'login'
      ? { email: form.email, password: form.password }
      : form; // register'da hepsi gider

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Laravel validation hataları genelde data.errors içinde gelir
        const firstError = data.errors
          ? Object.values(data.errors)[0] as string[]
          : [data.message];
        setError(firstError[0] || 'Bir hata oluştu.');
        return;
      }

      // Başarılı! Context'e kaydet ve yönlendir
      login(data.user, data.token);
      router.push('/'); // ana sayfaya git

    } catch {
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">📩 MailPulse</h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
        </p>

        {/* Hata mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ad Soyad — sadece kayıtta göster */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Ahmet Yılmaz"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="ahmet@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="••••••"
            />
          </div>

          {/* Şifre tekrar — sadece kayıtta */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrar</label>
              <input
                type="password" name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="••••••"
              />
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                       text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? 'Lütfen bekleyin...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        {/* Mod değiştirme */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'login' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-blue-600 hover:underline font-medium"
          >
            {mode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
}