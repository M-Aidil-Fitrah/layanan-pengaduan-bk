import { SiteHeader } from "@/components/layout/site-header";
import { CategoryGrid } from "@/features/complaints/components/category-grid";
import { ComplaintForm } from "@/features/complaints/components/complaint-form";
import { ComplaintJourneyProvider } from "@/features/complaints/components/complaint-journey-context";
import { TrackingForm } from "@/features/complaints/components/tracking-form";

const steps = [
  ["01", "Pilih topik", "Mulai dari kategori yang paling mendekati situasimu."],
  ["02", "Ceritakan secukupnya", "Bagikan hal yang relevan, dengan atau tanpa identitas."],
  ["03", "Simpan kode", "Gunakan kode pribadi untuk memeriksa status yang tersedia."],
] as const;

export function HomePage() {
  return (
    <ComplaintJourneyProvider>
      <SiteHeader />
      <main>
        <section className="hero" id="utama">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> RUANG AMAN UNTUK BERCERITA</p>
              <h1>Ada ruang untuk setiap <em>cerita.</em></h1>
              <p className="lead">Sampaikan keluhan, kesulitan, atau hal yang sedang kamu hadapi. Layanan Bimbingan dan Konseling hadir untuk mendengarkan tanpa menghakimi.</p>
              <div className="actions">
                <a className="button button-primary" href="#pengaduan">Mulai bercerita <span aria-hidden="true">↗</span></a>
                <a className="text-link" href="#cara-kerja"><span className="play-mark" aria-hidden="true">↓</span> Lihat cara kerja</a>
              </div>
              <div className="hero-assurances" aria-label="Fitur utama">
                <span>✓ Tanpa akun</span>
                <span>✓ Pilihan anonim</span>
                <span>✓ Kode pelacakan</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Ilustrasi ruang percakapan yang suportif">
              <div className="visual-card visual-card-top"><span className="pulse-dot" /><p><strong>Kamu boleh bercerita</strong><small>Sesuai ritme dan kenyamananmu</small></p></div>
              <div className="conversation-art">
                <div className="window-light" />
                <div className="plant"><i /><i /><i /></div>
                <div className="person person-left"><span /><i /></div>
                <div className="person person-right"><span /><i /></div>
                <div className="table-art" />
              </div>
              <div className="visual-card visual-card-bottom"><span aria-hidden="true">♡</span><p><strong>Privasi dihormati</strong><small>Bagikan hanya yang kamu perlukan</small></p></div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Prinsip layanan">
          <div className="container trust-items">
            <p><span>01</span><strong>Didengarkan</strong><small>Setiap cerita layak mendapat ruang.</small></p>
            <p><span>02</span><strong>Dihormati</strong><small>Kamu memilih informasi yang dibagikan.</small></p>
            <p><span>03</span><strong>Ditindaklanjuti</strong><small>Status dapat diperiksa dengan kode.</small></p>
          </div>
        </section>

        <section className="section topics-section" id="layanan">
          <div className="container">
            <header className="section-heading">
              <div><p className="eyebrow"><span /> MULAI DARI SINI</p><h2>Hal apa yang ingin kamu <em>sampaikan?</em></h2></div>
              <p>Setiap pengalaman berbeda. Pilih topik yang paling mendekati ceritamu untuk langsung memulai formulir.</p>
            </header>
            <CategoryGrid />
          </div>
        </section>

        <section className="section process-section" id="cara-kerja">
          <div className="container process-grid">
            <div className="process-copy">
              <p className="eyebrow eyebrow-light"><span /> CARA KERJA</p>
              <h2>Sederhana, jelas, dan tetap dalam kendalimu.</h2>
              <p>Formulir memandu satu bagian pada satu waktu. Informasi tidak dinyatakan terkirim sebelum penyimpanan benar-benar berhasil.</p>
              <a href="#pengaduan">Mulai pengaduan <span aria-hidden="true">→</span></a>
            </div>
            <ol className="process-list">
              {steps.map(([number, title, description]) => (
                <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section form-section" id="pengaduan">
          <div className="container form-layout">
            <div className="form-intro">
              <p className="eyebrow"><span /> FORMULIR PENGADUAN</p>
              <h2>Ceritakan dengan <em>caramu sendiri.</em></h2>
              <p>Kamu akan dipandu melalui empat langkah singkat. Isian yang sudah dibuat tetap berada di halaman jika pengiriman gagal.</p>
              <aside className="privacy-card">
                <span aria-hidden="true">⌁</span>
                <div><strong>Pilihan anonim tersedia</strong><p>Jika diaktifkan, nama dan kontak dikosongkan di browser dan diabaikan lagi oleh server.</p></div>
              </aside>
              <p className="operational-note">Layanan ini bukan alat diagnosis atau respons darurat otomatis.</p>
            </div>
            <div className="form-card"><ComplaintForm /></div>
          </div>
        </section>

        <section className="section tracking-section" id="lacak">
          <div className="container tracking-shell">
            <div className="tracking-copy"><p className="eyebrow eyebrow-light"><span /> LACAK PENGADUAN</p><h2>Tetap terhubung dengan ceritamu.</h2><p>Masukkan kode yang diterima setelah pengaduan berhasil disimpan. Hasil publik tidak menampilkan identitas atau isi ceritamu.</p></div>
            <TrackingForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand"><span className="brand-mark">r</span><div><strong>Ruang BK</strong><small>Dengarkan · Pahami · Bantu</small></div></div>
          <p>Identitas lembaga, kontak resmi, kebijakan privasi, dan jalur bantuan langsung perlu dilengkapi pengelola sebelum penggunaan publik.</p>
          <a href="/api-reference">Referensi API <span aria-hidden="true">↗</span></a>
        </div>
      </footer>
    </ComplaintJourneyProvider>
  );
}
