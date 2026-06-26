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
    // Admin panelinde kullanıcı bilgisi de geliyor
    user?: { id: number; name: string; email: string; role: string };
}

interface Props {
    token: string | null;
}

export default function AdminPanel({ token }: Props) {
    const fetcher = (url: string) =>
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        }).then(res => res.json());

    const { data: tickets, error, isLoading } = useSWR<Ticket[]>(
        token ? 'http://localhost:8000/api/tickets' : null,
        fetcher,
        { refreshInterval: 4000, revalidateOnFocus: true }
    );

    // 1. Verinin yüklenip yüklenmediğini veya backend'den dizi gelip gelmediğini kontrol et
    const isTicketsArray = Array.isArray(tickets);

    const stats = isTicketsArray ? {
        total: tickets.length,
        pending: tickets.filter(t => t.status === 'pending' || t.status === 'processing').length,
        completed: tickets.filter(t => t.status === 'completed').length,
        highPrio: tickets.filter(t => t.priority === 'Yüksek').length,
    } : { total: 0, pending: 0, completed: 0, highPrio: 0 }; // Veri yoksa veya hatalıysa sıfır kabul et

    // 2. Eğer veri henüz yükleniyorsa veya dizi değilse ekrana yükleniyor yazısı
    if (!tickets) {
        return <div className="p-8 text-gray-600">Veriler yükleniyor...</div>;
    }

    if (!isTicketsArray) {
        return (
            <div className="p-8 text-red-600 bg-red-50 rounded-lg border border-red-200">
                ⚠️ Yetkilendirme hatası veya geçersiz veri! Lütfen giriş yaptığınızdan emin olun.
            </div>
        );
    }
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">👑 Admin Paneli — Tüm Talepler</h2>

            {/* İstatistik kartları */}
            {stats && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Toplam', value: stats.total, color: 'blue' },
                        { label: 'Bekleyen', value: stats.pending, color: 'amber' },
                        { label: 'Tamamlanan', value: stats.completed, color: 'green' },
                        { label: 'Yüksek Öncelik', value: stats.highPrio, color: 'red' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <p className="text-xs text-gray-500 uppercase font-medium">{stat.label}</p>
                            <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Tüm ticket'ların tablosu */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                                <th className="p-3">ID</th>
                                <th className="p-3">Kullanıcı</th>  {/* Admin tüm kullanıcıları görür */}
                                <th className="p-3">Mesaj</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Aciliyet</th>
                                <th className="p-3">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {tickets?.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium text-gray-500">#{ticket.id}</td>
                                    <td className="p-3">
                                        <div className="font-semibold text-gray-800">{ticket.name}</div>
                                        <div className="text-xs text-gray-400">{ticket.email}</div>
                                    </td>
                                    <td className="p-3 max-w-xs truncate">{ticket.message}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${ticket.category ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-400'}`}>
                                            {ticket.category || 'Analiz ediliyor...'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.priority === 'Yüksek' ? 'bg-red-100 text-red-800' :
                                                ticket.priority === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                                                    ticket.priority === 'Düşük' ? 'bg-green-100 text-green-800' :
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
        </div>
    );
}