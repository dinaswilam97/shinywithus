import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartHydrator } from "@/components/CartHydrator";

export const metadata: Metadata = {
  title: "shinywithus | Fashion & Beauty",
  description:
    "متجرك الموثوق للأزياء ومستحضرات التجميل والعناية بالبشرة — توصيل لكل محافظات مصر.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* eslint-disable @next/next/no-page-custom-font -- Google Fonts CDN مطابق للمرجع */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@500;600;700&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* eslint-enable @next/next/no-page-custom-font */}
      </head>
      <body>
        <CartHydrator />
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
