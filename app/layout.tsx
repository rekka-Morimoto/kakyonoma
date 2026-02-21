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
  description: "メゾン・ド・きょー公式サイト",
  openGraph: {
    title: "かきょの間 (Kakyo-no-ma)",
    description: "メゾン・ド・きょー公式サイト",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "かきょの間 (Kakyo-no-ma)",
    description: "メゾン・ド・きょー公式サイト",
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
