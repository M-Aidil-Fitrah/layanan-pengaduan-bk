import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CategoryGrid } from "@/features/complaints/components/category-grid";

const processSteps = [
  ["01", "Pilih topik", "Pilih kategori yang paling dekat dengan hal yang ingin disampaikan."],
  ["02", "Tulis secukupnya", "Formulir memandu informasi inti tanpa meminta akun pelapor."],
  ["03", "Simpan kode", "Kode diberikan setelah database benar-benar menyimpan pengaduan."],
] as const;

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="site-container home-hero-grid">
            <div className="home-hero-copy">
              <p className="section-label">Layanan pengaduan BK</p>
              <h1>Tempat menyampaikan hal yang perlu didengar.</h1>
              <p>Gunakan formulir untuk menceritakan masalah pribadi, akademik, sosial, atau hal lain yang membutuhkan perhatian layanan Bimbingan dan Konseling.</p>
              <div className="hero-actions">
                <Link className="button" href="/pengaduan">Buat pengaduan</Link>
                <Link className="plain-link" href="/lacak">Saya sudah punya kode <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="home-illustration" aria-label="Ilustrasi percakapan antara pelapor dan petugas">
              <div className="room-window" />
              <div className="room-person room-person-left"><span /><i /></div>
              <div className="room-person room-person-right"><span /><i /></div>
              <div className="room-table" />
              <p>Setiap cerita dimulai dengan ruang untuk didengar.</p>
            </div>
          </div>
          <div className="site-container service-principles" aria-label="Prinsip layanan">
            <p><strong>Tanpa akun</strong><span>Pelapor dapat langsung mengisi formulir.</span></p>
            <p><strong>Pilihan anonim</strong><span>Nama dan kontak dapat dikosongkan.</span></p>
            <p><strong>Pelacakan mandiri</strong><span>Status publik diperiksa menggunakan kode.</span></p>
          </div>
        </section>

        <section className="home-section">
          <div className="site-container split-heading">
            <div><p className="section-label">Topik pengaduan</p><h2>Mulai dari hal yang paling dekat dengan ceritamu.</h2></div>
            <p>Kategori hanya membantu mengarahkan pengisian. Kamu tetap dapat menjelaskan situasinya dengan kata-katamu sendiri.</p>
          </div>
          <div className="site-container"><CategoryGrid /></div>
        </section>

        <section className="home-section process-block">
          <div className="site-container process-layout">
            <div>
              <p className="section-label">Cara kerja</p>
              <h2>Tiga bagian yang mudah dipahami.</h2>
              <p>Pengaduan baru dianggap terkirim setelah penyimpanan berhasil. Jika terjadi kegagalan, formulir tetap mempertahankan isian.</p>
            </div>
            <ol>
              {processSteps.map(([number, title, description]) => (
                <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="home-section privacy-section">
          <div className="site-container privacy-layout">
            <div><p className="section-label">Sebelum mengisi</p><h2>Bagikan informasi yang memang diperlukan.</h2></div>
            <div>
              <p>Hindari menulis kata sandi, nomor identitas, atau data pribadi lain yang tidak berkaitan dengan pengaduan. Mode anonim menghapus nama dan kontak dari payload serta penyimpanan.</p>
              <p>Layanan ini bukan alat diagnosis atau respons darurat otomatis. Jalur bantuan langsung perlu mengikuti kebijakan lembaga.</p>
              <Link className="plain-link" href="/pengaduan">Lanjut ke formulir <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
