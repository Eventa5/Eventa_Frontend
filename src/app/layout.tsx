import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTC = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSansTC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSansTC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSansTC-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-serif-tc",
  preload: false,
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
      <body className={`${notoSansTC.variable} antialiased`}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
