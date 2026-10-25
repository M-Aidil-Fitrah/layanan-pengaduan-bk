import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruang BK | Layanan Pengaduan",
  description:
    "Ruang yang aman untuk menyampaikan pengaduan kepada layanan Bimbingan dan Konseling.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
