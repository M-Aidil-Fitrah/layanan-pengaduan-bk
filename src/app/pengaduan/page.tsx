import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ComplaintFormShell } from "@/features/complaints/components/complaint-form-shell";

export const metadata: Metadata = {
  title: "Buat Pengaduan | Ruang BK",
  description: "Formulir bertahap untuk menyampaikan pengaduan kepada layanan BK.",
};

export default function ComplaintPage() {
  return (
    <>
      <SiteHeader />
      <main className="inner-page form-page">
        <div className="container form-page-shell">
          <header className="form-page-header">
            <Link className="back-link" href="/">← Beranda</Link>
            <div>
              <p className="section-label">Pengaduan baru</p>
              <h1>Formulir pengaduan</h1>
              <p>Isi satu bagian pada setiap langkah.</p>
            </div>
          </header>
          <section className="form-surface" aria-label="Formulir pengaduan">
            <Suspense fallback={<p className="form-loading">Menyiapkan formulir…</p>}>
              <ComplaintFormShell />
            </Suspense>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
