import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    title: "メゾン・ド._きょー (Maison de Kyo)",
    description: "きょーめいと非公式ファンサイト「メゾン・ド._きょー」入居者募集中",
    url: "https://maison-de-kyo.vercel.app",
    siteName: "メゾン・ド._きょー",
    images: [
      {
        url: "https://maison-de-kyo.vercel.app/banner.webp?.png",
        width: 1200,
        height: 630,
        alt: "メゾン・ド._きょー バナー",
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
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
        >
          {/* Entire Background Image - No cropping, fits width, scrolls with content */}
          <div className="maison-bg-root">
            <img src="/maison-bg.png" alt="" className="maison-bg-img" />
          </div>
          <main className="relative z-10">
            {children}
          </main>
        </body>
    </html>
  );
}
