import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TrackingForm } from "@/features/complaints/components/tracking-form";

export const metadata: Metadata = {
  title: "Lacak Pengaduan | Ruang BK",
  description: "Periksa status publik pengaduan menggunakan kode pelacakan.",
};

export default function TrackingPage() {
  return (
    <>
      <SiteHeader />
      <main className="inner-page tracking-page">
        <div className="container tracking-page-layout">
          <header className="tracking-intro">
            <Link className="back-link" href="/">← Kembali ke beranda</Link>
            <p className="section-label">Pelacakan pengaduan</p>
            <h1>Periksa status dengan kode yang kamu simpan.</h1>
            <p>Hasil pelacakan hanya menampilkan kode, status, dan waktu penerimaan. Identitas serta isi pengaduan tidak ditampilkan.</p>
          </header>
          <section className="tracking-surface" aria-label="Form pelacakan">
            <TrackingForm />
            <p className="tracking-help">Kode memiliki format <code>BK-</code> diikuti 20 karakter. Periksa kembali huruf dan angka jika kode belum dikenali.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
