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
  title: {
    default: "Solar Dashboard - Real-time Solar Power Monitoring",
    template: "%s | Solar Dashboard",
  },
  description:
    "Advanced solar power monitoring dashboard with real-time generation tracking, historical data analysis, and comprehensive energy production metrics. Monitor your solar system performance with detailed charts and analytics.",
  keywords: [
    "solar dashboard",
    "solar power monitoring",
    "solar energy tracking",
    "renewable energy dashboard",
    "solar analytics",
    "energy production monitoring",
    "solar system performance",
    "Havells solar monitoring",
    "real-time solar data",
    "solar power generation",
  ],
  authors: [{ name: "Solar Dashboard Team" }],
  creator: "Solar Dashboard Application",
  publisher: "Solar Monitoring Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://solar-dashboard.app",
    title: "Solar Dashboard - Real-time Solar Power Monitoring"
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
