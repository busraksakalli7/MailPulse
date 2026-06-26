'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Kullanıcı tipini tanımlıyoruz
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin'; // sadece bu iki değer olabilir
}

// Context'in içinde ne olacak
interface AuthContextType {
  user: User | null;           // null = giriş yapılmamış
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: boolean;            // kolaylık için
  isLoading: boolean;          // sayfa yüklenirken kontrol
}

// Context'i oluştur (başlangıç değerleri)
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
  isLoading: true,
});

// Provider: tüm uygulamayı sarıyor, state'i dağıtıyor
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sayfa yenilendiğinde localStorage'dan giriş bilgisini geri yükle
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false); // yükleme bitti
  }, []);

  // Giriş yapıldığında çağrılır
  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    // localStorage'a kaydet → sayfa yenilenince kaybolmasın
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Çıkış yapıldığında çağrılır
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Kullanım kolaylığı için custom hook
export function useAuth() {
  return useContext(AuthContext);
}