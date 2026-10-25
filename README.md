# Ruang BK — Layanan Pengaduan Bimbingan dan Konseling

Aplikasi fullstack untuk menyampaikan pengaduan kepada layanan Bimbingan dan Konseling secara bertahap, dengan pilihan anonim dan kode pelacakan. Antarmuka dibangun mobile-first untuk ponsel, tablet, dan desktop.

## Stack

- Next.js 16, React 19, dan TypeScript strict.
- PostgreSQL dan Prisma 7 dengan adapter `pg`.
- Zod untuk validasi client dan server.
- REST API v1, OpenAPI 3.1, dan Scalar.
- Tailwind CSS 4 sebagai pipeline CSS, dengan sistem desain aplikasi di `globals.css`.

## Menjalankan secara lokal

```bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm dev
```

Ganti placeholder di `.env` dengan koneksi PostgreSQL lokal sebelum menjalankan migrasi. Buka `http://localhost:3000` untuk aplikasi dan `http://localhost:3000/api-reference` untuk referensi API.

## Struktur utama

```text
src/app/                         halaman dan Route Handler
src/components/                  komponen layout bersama
src/features/complaints/         UI, schema, service, dan repository pengaduan
src/features/home/               komposisi halaman publik
src/lib/                         database, respons API, dan OpenAPI
prisma/                           schema serta migrasi PostgreSQL
docs/backend.md                   panduan backend dan batas implementasi
tests/                            pemeriksaan API dan browser
```

## Pemeriksaan

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Pemeriksaan API dan browser memerlukan server test yang sedang berjalan. Cara menjalankan serta environment yang dibutuhkan dijelaskan di [docs/backend.md](./docs/backend.md).

## Batas saat ini

Fitur publik pengiriman dan pelacakan terbatas sudah diimplementasikan. Area petugas, autentikasi, workflow status lanjutan, kebijakan privasi final, rate limiting, identitas lembaga, kontak resmi, dan prosedur darurat belum ditentukan sehingga tidak dibuat secara spekulatif.
