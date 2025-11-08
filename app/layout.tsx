import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FontAwesomeLoader from "@/components/FontAwesomeLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mizraksuaritma.com'),
  title: "Mızrak Su Arıtma Sistemleri - Diyarbakır | Su Arıtma Cihazı",
  description: "Diyarbakır'da su arıtma sistemleri, bakım, onarım ve filtre değişimi hizmetleri. Mızrak Su Arıtma ile 15 yılı aşkın tecrübemizle Diyarbakır'ın her noktasına profesyonel su arıtma çözümleri sunuyoruz. 7/24 servis hizmeti.",
  keywords: [
    "Diyarbakır su arıtma",
    "Mızrak su arıtma",
    "Diyarbakır su arıtma cihazı",
    "su arıtma sistemleri Diyarbakır",
    "Diyarbakır su arıtma servisi",
    "su arıtma bakım Diyarbakır",
    "su arıtma filtre değişimi",
    "reverse osmosis Diyarbakır",
    "su arıtma cihazı Diyarbakır",
    "Diyarbakır su arıtma firmaları",
    "su arıtma montaj Diyarbakır",
    "Hamdi Usta su arıtma",
    "Diyarbakır içme suyu arıtma",
    "su arıtma servis Diyarbakır",
    "Diyarbakır su arıtma tamiri"
  ],
  authors: [{ name: "Mızrak Su Arıtma Sistemleri" }],
  creator: "Mızrak Su Arıtma Sistemleri",
  publisher: "Mızrak Su Arıtma Sistemleri",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://mizraksuaritma.com',
    siteName: 'Mızrak Su Arıtma Sistemleri',
    title: 'Mızrak Su Arıtma Sistemleri - Diyarbakır | Su Arıtma Cihazı',
    description: "Diyarbakır'da su arıtma sistemleri, bakım, onarım ve filtre değişimi hizmetleri. 15 yılı aşkın tecrübemizle Diyarbakır'ın her noktasına profesyonel su arıtma çözümleri.",
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Mızrak Su Arıtma Sistemleri Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mızrak Su Arıtma Sistemleri - Diyarbakır',
    description: "Diyarbakır'da su arıtma sistemleri, bakım, onarım ve filtre değişimi hizmetleri. 15 yılı aşkın tecrübemizle profesyonel çözümler.",
    images: ['/logo.svg'],
  },
  alternates: {
    canonical: 'https://mizraksuaritma.com',
  },
  category: 'Su Arıtma Sistemleri',
  classification: 'Su Arıtma, Bakım ve Servis',
  other: {
    'contact:phone_number': '+905362363168',
    'contact:region': 'Diyarbakır, Türkiye',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FontAwesomeLoader />
        {children}
      </body>
    </html>
  );
}
