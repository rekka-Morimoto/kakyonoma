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
  description: "メゾン・ド・きょー公式サイト。自分だけの入居届を作り、仲間たちとの時間を過ごしましょう。",
  openGraph: {
    title: "メゾン・ド・きょー (Maison de Kyo)",
    description: "メゾン・ド・きょー公式サイト。自分だけの入居届を作り、仲間たちとの時間を過ごしましょう。",
    url: "https://maison-de-kyo.vercel.app",
    siteName: "メゾン・ド・きょー",
    images: [
      {
        url: "https://maison-de-kyo.vercel.app/banner.webp",
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
    description: "メゾン・ド._きょー公式サイト。自分だけの入居届を作り、仲間たちとの時間を過ごしましょう。",
    images: ["https://maison-de-kyo.vercel.app/banner.webp"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
