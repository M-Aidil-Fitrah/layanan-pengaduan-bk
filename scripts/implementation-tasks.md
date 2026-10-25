# Pelaksanaan Proyek Layanan Pengaduan BK

Dokumen ini mencatat pekerjaan implementasi yang sedang dijalankan berdasarkan [context.md](./context.md). Status diperbarui setiap tahap selesai dengan bukti pemeriksaan yang benar-benar dijalankan.

## Prinsip pelaksanaan

- Modular monolith Next.js dengan TypeScript/TSX, PostgreSQL, Prisma, Zod, REST API, OpenAPI, dan Scalar.
- Halaman hanya menyusun fitur; UI, kontrak, service, dan akses data dipisahkan menurut tanggung jawab.
- Tidak membangun area konselor, autentikasi, workflow status akhir, atau kebijakan operasional yang context.md tandai belum ditentukan.
- Kode publik dibangun mobile-first dan diverifikasi pada desktop, tablet, serta ponsel.
- Setiap perubahan dikelompokkan menjadi commit kecil yang koheren, memakai identitas Git manusia yang sudah dikonfigurasi, tanpa trailer atau atribusi LLM.

## Daftar pekerjaan

| Status | Pekerjaan | Bukti/hasil |
| --- | --- | --- |
| Selesai | Membaca konteks dan panduan Next.js lokal | `scripts/context.md`, `AGENTS.md`, dokumentasi Route Handlers, Backend for Frontend, Authentication, dan Server/Client Components telah diperiksa. |
| Selesai | Menyiapkan dependensi dan fondasi backend | Prisma 7.10, adapter PostgreSQL, Scalar, dan dotenv terpasang dengan versi terkunci. Schema lolos format/validasi/generate; migrasi berhasil diterapkan pada PostgreSQL 18 sementara yang terisolasi. `.env` project tetap placeholder dan tidak dipakai untuk pengujian tersebut. |
| Selesai | Membuat kontrak pengaduan dan schema Prisma | Kontrak Zod, schema, migrasi, unique tracking code, serta constraint identitas anonim tersedia. Record anonim dan non-anonim telah diperiksa langsung pada database test. |
| Selesai | Membuat REST API v1 | POST pengaduan, GET pelacakan, respons error, batas 16 KiB, OpenAPI 3.1, dan Scalar tersedia. HTTP invalid/unavailable serta alur sukses persisten telah diuji. |
| Selesai | Membuat pengalaman publik modern | Landing responsif, category picker, form stepper empat tahap, review, anonim, konfirmasi, pelacakan, dan menu mobile tersedia. Browser test produksi lulus pada 390/768/1440 tanpa overflow atau console error tak terduga. |
| Selesai | Menulis panduan backend dan memverifikasi | README, contoh environment, dan panduan backend sudah ditulis. Generate Prisma tanpa `DATABASE_URL`, format/validasi schema, lint, typecheck, build produksi, API persisten, dan browser lintas viewport lulus setelah perubahan setup terakhir. |
| Selesai | Membuat commit kecil | Unit validasi, data, API, OpenAPI, UI, pengujian, tooling, dan dokumentasi dipisahkan menjadi commit koheren. Setiap commit yang selesai langsung di-push ke `origin/main`. |

## Batas implementasi saat ini

- Pelapor tidak memerlukan akun.
- Pengaduan anonim tidak menyimpan nama atau kontak.
- Detail konselor dan autentikasi belum dibangun karena kebijakan akses belum disepakati.
- Status publik awal dibatasi pada penerimaan/menunggu peninjauan; tidak ada catatan internal atau detail tindak lanjut yang dipublikasikan.

## Riwayat pembaruan

- 25 Oktober 2026 — Pekerjaan dimulai; struktur, batas, dan aturan commit direkam.
- 25 Oktober 2026 — Fondasi UI publik, komponen reusable, serta validasi Zod dibuat. `pnpm lint` lulus. Build awal gagal karena starter project mengambil font Google saat jaringan sandbox dibatasi; dependensi font eksternal dihapus agar build dapat diverifikasi offline.
- 25 Oktober 2026 — `pnpm typecheck` lulus. `next build` Turbopack gagal saat sandbox mencegah loader CSS membuka port internal; build Webpack juga gagal pada pembacaan konfigurasi TypeScript, meskipun `tsc --showConfig` dan `tsc --noEmit` lulus. Kegagalan build belum dinyatakan sebagai keberhasilan.
- 25 Oktober 2026 — Commit kecil `feat(ui): add public complaint interface` disiapkan setelah lint, typecheck, dan diff check lulus. Percobaan stage/commit/push dihentikan sandbox sebelum staging karena `.git/index.lock` tidak dapat dibuat pada `.git` yang read-only; tidak ada commit parsial maupun push.
- 25 Oktober 2026 — Lingkungan baru diverifikasi. Commit `feat(complaints): add submission validation`, `feat(data): define complaint persistence model`, dan `feat(ui): add public complaint interface` dibuat dengan identitas Git pengguna lalu berhasil di-push ke `origin/main`.
- 25 Oktober 2026 — Verifikasi ulang: `pnpm lint`, `next typegen`, dan `pnpm typecheck` lulus. `pnpm build` belum lulus karena Turbopack gagal membuka port proses CSS (`EPERM`); kegagalan ini tetap dicatat dan belum dianggap selesai.
- 25 Oktober 2026 — Prisma 7.10, adapter PostgreSQL, dotenv, dan Scalar dipasang. Generator lama dimigrasikan ke `prisma-client`; format, validasi schema, generate client, typecheck, dan lint lulus. Commit dependensi dan konfigurasi Prisma sudah di-push terpisah. PostgreSQL lokal aktif, tetapi `.env` masih placeholder sehingga migrasi runtime belum dijalankan.
- 25 Oktober 2026 — REST API pengiriman/pelacakan, service, repository, migrasi awal, OpenAPI 3.1, dan Scalar dibuat dalam commit terpisah. Uji HTTP membuktikan 400/404/415/422/503 dipetakan tanpa stack trace atau konfirmasi palsu.
- 25 Oktober 2026 — UI publik didesain ulang dengan gaya modern dan form stepper empat tahap. `pnpm ui:check` memverifikasi menu mobile, kategori, seluruh tahap form, mode anonim, payload, pelacakan invalid, overflow, dan browser console pada viewport 390/768/1440.
- 25 Oktober 2026 — `pnpm build` produksi lulus. Build menghasilkan route statis untuk halaman, OpenAPI, dan Scalar serta route dinamis untuk submission/pelacakan.
- 25 Oktober 2026 — Cluster PostgreSQL 18 sekali pakai dibuat di `/tmp` pada port 55432. `prisma migrate deploy` dan `prisma migrate status` lulus; `pnpm api:check` membuktikan dua pengaduan tersimpan, identitas anonim menjadi `NULL`, identitas opsional non-anonim tersimpan, dan respons tracking hanya berisi `createdAt`, `status`, serta `trackingCode`. `pnpm ui:check` juga lulus terhadap server produksi dengan database aktif.
- 25 Oktober 2026 — Setup Prisma diperkeras agar `prisma generate` dan `postinstall` dapat berjalan tanpa kredensial database. Generate tanpa `DATABASE_URL`, format, validasi, lint, typecheck, dan build produksi lulus.
- 25 Oktober 2026 — Verifikasi akhir terhadap server produksi dan PostgreSQL test lulus: `pnpm api:check` memeriksa persistensi serta privasi data, sedangkan `EXPECT_DATABASE_AVAILABLE=true pnpm ui:check` lulus pada viewport 390/768/1440 tanpa browser error tak terduga. Cluster dan data fiktif sekali pakai kemudian dihentikan dan dihapus.
- 25 Oktober 2026 — README, contoh environment aman, panduan backend, perintah deployment migrasi, serta status pelaksanaan diselesaikan. Batas fitur yang belum diputuskan tetap dicatat dan tidak diklaim sebagai fitur siap produksi.
