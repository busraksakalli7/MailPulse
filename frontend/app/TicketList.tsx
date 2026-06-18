// src/app/TicketList.tsx
'use client';

// 1. İfadenin doğrusunu import olarak güncelledik
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TicketList() {
  // 2. Tipi kesin olarak <Ticket[]> şeklinde eşitledik
  const { data: tickets, error, isLoading } = useSWR<Ticket[]>(
    'http://127.0.0.1:8000/api/tickets',
    fetcher,
    {
      refreshInterval: 4000, 
      revalidateOnFocus: true, 
    }
  );

  if (error) return <div className="text-red-500 p-4">Veriler yüklenirken bir hata oluştu.</div>;
  if (isLoading || !tickets) return <div className="text-gray-500 animate-pulse p-4">Tablo güncelleniyor...</div>;

  return (
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Gelen Talepler Kontrol Paneli (SWR Aktif)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
              <th className="p-3">ID</th>
              <th className="p-3">Kullanıcı</th>
              <th className="p-3">Mesaj</th>
              <th className="p-3">Yapay Zeka Kategorisi</th>
              <th className="p-3">Aciliyet</th>
              <th className="p-3">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium text-gray-500">#{ticket.id}</td>
                <td className="p-3">
                  <div className="font-semibold text-gray-800">{ticket.name}</div>
                  <div className="text-xs text-gray-400">{ticket.email}</div>
                </td>
                <td className="p-3 max-w-xs truncate">{ticket.message}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.category ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-400'}`}>
                    {ticket.category || 'Analiz Edilmedi'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'Yüksek' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.priority === 'Düşük' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {ticket.priority || 'Belirsiz'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs font-semibold ${ticket.status === 'completed' ? 'text-green-600' : 'text-amber-500'}`}>
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