'use client';

import useSWR from 'swr';

interface Ticket {
  id: number;
  name: string;
  email: string;
  message: string;
  category: string | null;
  priority: string | null;
  status: string;
  created_at: string;
}

// token parametresi alıyoruz — korumalı endpoint için gerekli
interface Props {
  token: string | null;
}

export default function TicketList({ token }: Props) {
  // fetcher artık Authorization header gönderiyor
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }).then(res => res.json());

  const { data: tickets, error, isLoading } = useSWR<Ticket[]>(
    token ? 'http://localhost:8000/api/tickets' : null, // token yoksa istek atma
    fetcher,
    { refreshInterval: 4000, revalidateOnFocus: true }
  );

  if (error)     return <div className="text-red-500 p-4">Veriler yüklenirken hata oluştu.</div>;
  if (isLoading) return <div className="text-gray-500 animate-pulse p-4">Yükleniyor...</div>;
  if (!tickets?.length) return (
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center text-gray-500">
      Henüz destek talebiniz bulunmuyor.
    </div>
  );

  return (
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Taleplerim</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
              <th className="p-3">ID</th>
              <th className="p-3">Mesaj</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Aciliyet</th>
              <th className="p-3">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium text-gray-500">#{ticket.id}</td>
                <td className="p-3 max-w-xs truncate">{ticket.message}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${ticket.category ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-400'}`}>
                    {ticket.category || 'Analiz ediliyor...'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'Yüksek' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'Orta'   ? 'bg-yellow-100 text-yellow-800' :
                    ticket.priority === 'Düşük'  ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {ticket.priority || 'Belirsiz'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs font-semibold
                    ${ticket.status === 'completed' ? 'text-green-600' : 'text-amber-500'}`}>
                    {ticket.status === 'completed' ? '✅ Tamamlandı' : '⏳ İşleniyor'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}