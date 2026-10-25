import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span aria-hidden="true" className="brand-mark">R</span>
          <span><strong>Ruang BK</strong><small>Layanan pengaduan</small></span>
        </div>
        <p>Identitas lembaga, kontak resmi, kebijakan privasi, dan jalur bantuan langsung perlu ditetapkan sebelum penggunaan publik.</p>
        <nav aria-label="Navigasi footer">
          <Link href="/pengaduan">Buat pengaduan</Link>
          <Link href="/lacak">Lacak status</Link>
          <Link href="/api-reference">Referensi API</Link>
        </nav>
      </div>
    </footer>
  );
}
