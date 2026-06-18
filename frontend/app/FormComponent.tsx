// src/app/FormComponent.tsx
'use client'; 

interface FormComponentProps {
  onSubmitAction: (name: string, email: string, message: string) => Promise<void>;
}

export default function FormComponent({ onSubmitAction }: FormComponentProps) {

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    const formElement = e.currentTarget; 
    
    const formData = new FormData(formElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    await onSubmitAction(name, email, message);
    formElement.reset();
  }

  return (
    <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">📩 MailPulse</h1>
      <p className="text-sm text-gray-500 mb-6">Akıllı Destek Talebi ve Otomasyon Sistemi</p>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white" placeholder="Ahmet Yılmaz" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input type="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white" placeholder="ahmet@example.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destek Mesajı</label>
          <textarea name="message" required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white" placeholder="Yaşadığınız sorunu yazınız..." />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
          Destek Talebi Gönder
        </button>
      </form>
    </div>
  );
}