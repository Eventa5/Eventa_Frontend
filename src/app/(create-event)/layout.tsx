import localFont from "next/font/local";
import "@/styles/globals.css";
import CreateEventFooter from "@/components/layout/create-event-footer";
import CreateEventHeader from "@/components/layout/create-event-header";
import ErrorDialog from "@/components/ui/error-dialog";
import type { ReactNode } from "react";

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

export default function CreateEventLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased font-sans-tc`}
        suppressHydrationWarning
      >
        {" "}
        <div className="flex flex-col min-h-screen bg-[#f8fbfd]">
          <CreateEventHeader />
          <div className="flex flex-col justify-stretch min-h-[calc(100vh-112px)] items-center px-5 py-8">
            <div className="w-full min-h-full lg:max-w-[80%]">{children}</div>
          </div>
          <CreateEventFooter />
          <ErrorDialog />
        </div>
      </body>
    </html>
  );
}
