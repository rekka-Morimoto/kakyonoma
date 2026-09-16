import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../lib/i18nContext";
import LanguageSelector from "../components/LanguageSelector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "メゾン・ド・きょー (Maison de Kyo)",
  description: "きょーめいと非公式ファンサイト「メゾン・ド・きょー」入居者募集中",
  openGraph: {
    title: "メゾン・ド・きょー (Maison de Kyo)",
    description: "きょーめいと非公式ファンサイト「メゾン・ド・きょー」入居者募集中",
    url: "https://maison-de-kyo.vercel.app",
    siteName: "メゾン・ド・きょー",
    images: [
      {
        url: "https://maison-de-kyo.vercel.app/banner.webp?.png",
        width: 1200,
        height: 630,
        alt: "メゾン・ド・きょー バナー",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "メゾン・ド・きょー (Maison de Kyo)",
    description: "きょーめいと非公式ファンサイト「メゾン・ド・きょー」入居者募集中",
    images: ["https://maison-de-kyo.vercel.app/banner.webp?.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <LanguageProvider>
          {/* Floating Language Switcher accessible from all pages including /terms */}
          <LanguageSelector />
          
          {/* 
            Natural Flow Background - This defines the total page height.
            The scroll will end exactly where this image ends.
          */}
          <div className="maison-bg-root">
            <img src="/maison-bg.png" alt="" className="maison-bg-img" />
            
            {/* The main content is overlaid on top of the natural-flow background */}
            <main className="maison-main-overlay">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
