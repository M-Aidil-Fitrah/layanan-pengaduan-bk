# Panduan Backend Layanan Pengaduan BK

## Arsitektur

Aplikasi berjalan sebagai modular monolith Next.js. Route Handler menjadi batas HTTP, service memegang aturan bisnis, repository membatasi akses Prisma, dan PostgreSQL menyimpan pengaduan secara persisten.

```text
Browser atau client lain
          |
          v
  /api/v1 Route Handler
          |
          v
  complaint-service.ts
          |
          v
complaint-repository.ts
          |
          v
 Prisma 7 + PostgreSQL
```

Kode Prisma hanya diimpor oleh modul berpenanda `server-only`. UI tidak menerima model database secara langsung.

## Konfigurasi lokal

Prasyarat:

- Node.js 24 dan pnpm 11.
- PostgreSQL yang dapat diakses dari mesin aplikasi.
- Database kosong yang boleh menerima migrasi proyek.

Salin contoh environment dan ganti seluruh placeholder:

```bash
cp .env.example .env
```

`DATABASE_URL` mengikuti format koneksi PostgreSQL. Jangan commit kredensial nyata.

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

Pasang dependensi, hasilkan Prisma Client, dan terapkan migrasi pengembangan:

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Untuk lingkungan deployment yang hanya menerapkan migrasi yang sudah ada:

```bash
pnpm db:deploy
pnpm build
pnpm start
```

## Kontrak HTTP

### `POST /api/v1/complaints`

Menerima pengaduan publik, memvalidasi body dengan Zod, menghapus nama dan kontak ketika `isAnonymous` bernilai `true`, lalu menyimpan record beserta kode acak kriptografis.

Keberhasilan menggunakan status `201`. Respons publik hanya berisi:

- `trackingCode`
- `status`
- `createdAt`

Body non-JSON ditolak dengan `415`, JSON rusak dengan `400`, body di atas 16 KiB dengan `413`, dan kontrak invalid dengan `422`. Kegagalan penyimpanan tidak menghasilkan konfirmasi sukses.

### `GET /api/v1/complaints/{trackingCode}`

Mengembalikan status publik terbatas. Endpoint ini tidak mengirim nama, kontak, judul, uraian, identifier database, maupun catatan internal. Kode invalid atau tidak dikenal menghasilkan `404` dengan bentuk error yang sama.

Route Handler tidak di-cache dan seluruh respons pengaduan memakai `Cache-Control: no-store`.

## Aturan data dan privasi

- Kode pelacakan menggunakan 10 byte acak dari `node:crypto`, direpresentasikan sebagai 20 digit heksadesimal setelah prefix `BK-`.
- Unique index database menangani benturan kode; service mencoba ulang maksimal lima kali.
- Transformasi Zod menghapus identitas laporan anonim sebelum service dipanggil.
- Constraint `Complaint_anonymous_identity_check` menegakkan aturan anonim lagi pada PostgreSQL.
- Persetujuan wajib divalidasi untuk setiap pengiriman, tetapi belum disimpan sebagai riwayat versi kebijakan karena kebijakan final belum tersedia.
- Isi pengaduan dan kode pelacakan tidak ditulis ke log aplikasi oleh implementasi saat ini.

## OpenAPI dan Scalar

Spesifikasi OpenAPI 3.1 tersedia di `/api/openapi`. Referensi interaktif Scalar tersedia di `/api-reference` dan menggunakan versi renderer CDN yang dikunci eksplisit.

OpenAPI menjelaskan kontrak yang diimplementasikan; validasi runtime tetap berasal dari Zod pada Route Handler. Bila API berubah, perbarui schema runtime, handler, pengujian, dan OpenAPI dalam unit perubahan yang sama.

## Pemeriksaan kualitas

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm api:check
pnpm ui:check
```

`api:check` memerlukan server yang berjalan dan `DATABASE_URL` test. Pemeriksaan ini membuat data fiktif, memeriksa penyimpanan anonim/non-anonim langsung di PostgreSQL, lalu memastikan lookup publik tidak membocorkan field terlindungi.

`ui:check` memerlukan server yang berjalan dan Google Chrome pada `/usr/bin/google-chrome`. Script memeriksa viewport 390, 768, dan 1440 piksel, overflow horizontal, menu mobile, empat tahap formulir, penghapusan identitas anonim dari payload, pelacakan invalid, dan browser console. Set `EXPECT_DATABASE_AVAILABLE=true` bila server memakai database test yang aktif.

## Batas implementasi

Belum ada keputusan final untuk autentikasi petugas, workflow status, catatan tindak lanjut, rate limiting, kebijakan privasi/retensi, identitas lembaga, kontak resmi, jalur bantuan langsung, dan akses dokumentasi pada produksi. Bagian tersebut tidak boleh dianggap tersedia hanya karena fondasi API publik sudah berjalan.

Sebelum penggunaan nyata, pengelola juga perlu menentukan HTTPS/deployment, backup, pengelolaan secret, observabilitas yang tidak merekam data sensitif, dan prosedur operasional layanan.
