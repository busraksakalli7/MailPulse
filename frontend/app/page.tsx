// src/app/page.tsx
import FormComponent from './FormComponent';
import TicketList from './TicketList'; // Birazdan oluşturacağımız yeni liste bileşeni

export default function Home() {
  // Sunucu tarafındaki Server Action'ımız (Sadece veri göndermekle yükümlü)
  async function handleSubmitAction(name: string, email: string, message: string) {
    'use server';
    
    await fetch('http://127.0.0.1:8000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center gap-8">
      {/* Üst Kısım: Form */}
      <FormComponent onSubmitAction={handleSubmitAction} />

      {/* Alt Kısım: SWR ile beslenen Akıllı Tablo */}
      <TicketList />
    </main>
  );
}