import type { Metadata } from "next";
import "@/styles/globals.css";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Chatbot from "@/features/chatbot/components/chatbot";
import MobileSearchOverlay from "@/features/search/components/mobile-search-overlay";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import("@/services/api/interceptors");

const notoSansTC = localFont({
  src: [
    {
      path: "../../../public/fonts/NotoSansTC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/NotoSansTC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/NotoSansTC-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const notoSerifTC = localFont({
  src: [
    {
      path: "../../../public/fonts/NotoSerifTC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/NotoSerifTC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/NotoSerifTC-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-noto-serif-tc",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | Eventa",
    default: "Eventa",
  },
  description:
    "Eventa 是一個完整的票務管理平台，讓參與者能輕鬆搜尋、購買與管理活動票券，主辦方也能快速建立活動、管理票種與查看銷售情況，系統支援帳號整合登入、即時票務管理、QR Code 報到、AI 客服問答功能，打造流暢的活動體驗。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased font-sans-tc`}
        suppressHydrationWarning
      >
        <Header />
        {children}
        <Footer />
        <Chatbot />
        <MobileSearchOverlay />
        <Toaster />
      </body>
    </html>
  );
}
