# Smart Manufacturing - Machine Monitoring System

Aplikasi web berbasis **Laravel & React (Inertia.js)** untuk memonitor status mesin pabrik secara *real-time*. Sistem ini mendukung pengelolaan mesin, pencatatan produksi otomatis, hingga pembuatan laporan *shift* kerja, dilengkapi dengan otorisasi berbasis *role* (Admin & Operator).

## 🚀 Fitur Utama

- **Real-time Dashboard:** Memantau status mesin (Running, Idle, Maintenance, Error), output harian, dan peringatan secara *real-time* menggunakan **Laravel Reverb** (WebSockets).
- **Manajemen Mesin (CRUD):** Tambah, edit, dan hapus data mesin (khusus Admin).
- **Simulator Produksi:** Dilengkapi dengan *Artisan Command* bawaan untuk mensimulasikan mesin yang sedang beroperasi dan memproduksi *output*.
- **Log Produksi & Shift Report:** Pencatatan otomatis produksi per sekian detik, yang kemudian dapat direkapitulasi (generate) menjadi Laporan Shift yang komprehensif (Suhu rata-rata, Total Output, Uptime/Downtime).
- **Role-based Access Control (RBAC):** 
  - **Admin:** Memiliki kontrol penuh atas master data mesin dan manajemen *user*.
  - **Operator:** Hanya dapat melihat daftar mesin, melihat log, dan *generate* laporan tanpa hak akses merubah data fundamental.

## 🛠️ Tech Stack

- **Backend:** Laravel 13.x (PHP 8.3+)
- **Frontend:** React, Inertia.js, Tailwind CSS, shadcn/ui
- **WebSockets:** Laravel Reverb & Laravel Echo
- **Database:** MySQL 

## 📦 Prasyarat

Pastikan komputer Anda sudah terinstal:
- PHP >= 8.3
- Composer
- Node.js & npm

## ⚙️ Instalasi

1. **Clone repositori dan masuk ke direktori proyek:**
   ```bash
   git clone <repo-url>
   cd machine_monitoring
   ```

2. **Jalankan skrip instalasi:**
   Proyek ini sudah dilengkapi skrip setup di `composer.json`. Jalankan perintah berikut untuk menginstal dependensi PHP & Node, menyalin `.env`, membuat *Application Key*, dan menjalankan *migrasi*:
   ```bash
   composer setup
   ```
   *(Opsional)* Jika Anda ingin menginstal secara manual:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   npm install
   npm run build
   ```

3. **Seeding Database (Opsional):**
   Jika tersedia seeder untuk User/Mesin awal:
   ```bash
   php artisan migrate:fresh --seed
   ```

## 🏃‍♂️ Menjalankan Aplikasi Lokal

Proyek ini telah dikonfigurasi untuk menjalankan semua servis (*PHP Server, Queue Worker, Vite/React Server, dan Reverb WebSocket Server*) secara bersamaan dalam satu perintah *console*.

Jalankan perintah berikut:
```bash
composer run dev
```

Aplikasi dapat diakses di: **http://localhost:8000**

## 🏭 Menjalankan Simulator Mesin

Aplikasi ini memiliki sistem simulasi yang akan secara otomatis mengacak suhu, status mesin, dan menambah *output* produksi secara *real-time*.

Buka terminal **baru** dan jalankan perintah:
```bash
php artisan simulate:machines --interval=3
```
*Note: `--interval=3` berarti mesin akan memproduksi data baru setiap 3 detik. Pastikan `composer run dev` yang menjalankan `queue:listen` sedang aktif karena simulator melempar proses ke Queue.*

## 🔒 Otentikasi & Role

Sistem menggunakan 2 tipe pengguna:
1. **Admin (`role: admin`)**: Akses penuh, termasuk manajemen pengguna dan CRUD mesin.
2. **Operator (`role: operator`)**: Hanya akses baca (*Read-only*) pada mesin dan laporan.

## 📈 Optimasi Performa Database
Log produksi dapat menghasilkan data yang sangat besar dalam waktu singkat (Ratusan ribu baris per hari). Proyek ini sudah dirancang menggunakan agregasi kueri SQL murni dan telah terindeks secara komposit (`machine_id`, `shift`, `logged_at`) untuk menghindari *memory exhaustion* maupun beban RAM yang berat saat membuat Laporan Shift.


