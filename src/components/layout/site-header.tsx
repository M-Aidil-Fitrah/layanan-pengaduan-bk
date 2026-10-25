"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  { href: "/", label: "Beranda" },
  { href: "/pengaduan", label: "Buat pengaduan" },
  { href: "/lacak", label: "Lacak status" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function closeNavigation() {
    setIsOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link className="brand" href="/" onClick={closeNavigation}>
          <span aria-hidden="true" className="brand-mark">R</span>
          <span><strong>Ruang BK</strong><small>Layanan pengaduan</small></span>
        </Link>
        <button aria-controls="main-navigation" aria-expanded={isOpen} className="menu-toggle" onClick={() => setIsOpen((value) => !value)} type="button">
          <span className="visually-hidden">{isOpen ? "Tutup" : "Buka"} menu</span>
          <span aria-hidden="true">{isOpen ? "Tutup" : "Menu"}</span>
        </button>
        <nav aria-label="Navigasi utama" className={isOpen ? "main-navigation is-open" : "main-navigation"} id="main-navigation">
          {navigationItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link aria-current={isActive ? "page" : undefined} href={item.href} key={item.href} onClick={closeNavigation}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
