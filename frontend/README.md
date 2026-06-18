# 📩 MailPulse - AI Powered Support Ticket Automation

MailPulse, kullanıcıların destek taleplerini anında alan, arka planda yapay zeka (AI) yardımıyla bu talepleri kategorize edip aciliyet durumunu belirleyen modern bir Full-Stack otomasyon sistemidir.

🚀 **SWR (Stale-While-Revalidate)** mimarisi sayesinde admin paneli sayfa yenilenmeden, akıllı periyodik kontrol (polling) ile arka plandaki güncellemeleri anlık olarak ekrana yansıtır.

## 🏗️ Mimari ve Teknolojiler

* **Frontend:** Next.js 15 (App Router), Tailwind CSS, SWR (Smart Polling)
* **Backend:** Laravel 11, Eloquent ORM, SQLite
* **Yapay Zeka (AI):** Ollama (Qwen3:8B Modeli)
* **Asenkron Yapı:** Laravel Queue (Database Driver) ile sistem kilitlenmesini önleyen arka plan işçileri (Workers)

---

## 🚀 Kurulum ve Çalıştırma

Projenizi yerelde çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

### 1. Projeyi Klonlayın

```bash
git clone <github-depo-adresiniz>
cd MailPulse
```

### 2. Backend (Laravel) Kurulumu

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

touch database/database.sqlite

php artisan migrate

php artisan serve
```

### 3. Arka Plan İşçisini (Queue Worker) Başlatın

Yapay zeka analizlerinin asenkron işlenmesi için yeni bir terminal açın ve backend klasörü içinde şu komutu çalıştırın:

```bash
php artisan queue:work
```

### 4. Frontend (Next.js) Kurulumu

Yeni bir terminal açın ve frontend klasörüne geçiş yapın:

```bash
cd frontend

npm install

npm run dev
```

### 5. Yapay Zeka (Ollama) Yapılandırması

Lokalinizde Ollama'nın çalıştığından ve modelin yüklü olduğundan emin olun:

```bash
ollama run qwen3:8b
```

---

## ⚙️ Sistem Akışı

1. Kullanıcı destek talebi oluşturur.
2. Talep veritabanına kaydedilir.
3. Laravel Queue üzerinden AI analiz görevi kuyruğa alınır.
4. Queue Worker, Ollama API ile iletişim kurar.
5. AI; kategori ve öncelik bilgilerini belirler.
6. Sonuçlar veritabanına kaydedilir.
7. Admin paneli SWR polling sayesinde değişiklikleri otomatik olarak görüntüler.

---

## 🎯 Özellikler

* ✅ Yapay zeka destekli talep sınıflandırma
* ✅ Otomatik öncelik belirleme
* ✅ Asenkron işleme (Queue System)
* ✅ Gerçek zamanlı veri güncelleme (SWR)
* ✅ Modern ve responsive arayüz
* ✅ Laravel 11 + Next.js 15 Full-Stack mimarisi
* ✅ SQLite ile hızlı kurulum

