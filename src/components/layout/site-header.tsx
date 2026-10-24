"use client";

import { useState } from "react";

const navigationItems = [
  { href: "#layanan", label: "Layanan" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#lacak", label: "Lacak laporan" },
] as const;

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  function closeNavigation() {
    setIsOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-content">
        <a className="brand" href="#utama" onClick={closeNavigation}>
          <span aria-hidden="true" className="brand-mark">◌</span>
          <span><strong>Ruang BK</strong><small>Dengarkan · Pahami · Bantu</small></span>
        </a>
        <button aria-controls="main-navigation" aria-expanded={isOpen} className="menu-toggle" onClick={() => setIsOpen((value) => !value)} type="button">
          <span className="visually-hidden">{isOpen ? "Tutup" : "Buka"} menu</span>
          <span aria-hidden="true">{isOpen ? "×" : "☰"}</span>
        </button>
        <nav className={isOpen ? "main-navigation is-open" : "main-navigation"} id="main-navigation">
          {navigationItems.map((item) => <a href={item.href} key={item.href} onClick={closeNavigation}>{item.label}</a>)}
          <a className="button button-small" href="#pengaduan" onClick={closeNavigation}>Buat pengaduan</a>
        </nav>
      </div>
    </header>
  );
}
