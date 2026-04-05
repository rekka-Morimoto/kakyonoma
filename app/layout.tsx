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
  title: "かきょの間 (Kakyo-no-ma)",
  description: "メゾン・ド・きょー公式サイト。自分だけの入居届を作り、仲間たちとの時間を過ごしましょう。",
  openGraph: {
    title: "かきょの間 (Kakyo-no-ma)",
    description: "メゾン・ド・きょー公式サイト。自分だけの入居届を作り、仲間たちとの時間を過ごしましょう。",
    url: "https://kakyonoma.vercel.app",
    siteName: "かきょの間",
    images: [
      {
        url: "https://kakyonoma.vercel.app/banner.webp",
        width: 1200,
        height: 630,
        alt: "かきょの間 バナー",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "かきょの間 (Kakyo-no-ma)",
    description: "メゾン・ド・きょー公式サイト。自分だけの入居届を作り、仲間たちとの時間を過ごしましょう。",
    images: ["https://kakyonoma.vercel.app/banner.webp"],
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
