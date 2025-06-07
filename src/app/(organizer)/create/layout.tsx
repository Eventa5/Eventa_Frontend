import localFont from "next/font/local";
import "@/styles/globals.css";
import ErrorDialog from "@/components/ui/error-dialog";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const notoSansTC = localFont({
  src: [
    {
      path: "../../../../public/fonts/NotoSansTC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/NotoSansTC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/NotoSansTC-Black.ttf",
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
      path: "../../../../public/fonts/NotoSerifTC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/NotoSerifTC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/NotoSerifTC-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-noto-serif-tc",
  display: "swap",
  preload: true,
});

function OrganizerLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-center items-center py-2 shadow-md relative z-10">
        <Link href="/organizer">
          <Image
            className="cursor-pointer"
            src="/eventa-logo-horizontal.svg"
            alt="logo"
            width={145}
            height={44}
          />
        </Link>
      </header>
      <div className="flex-1 flex flex-col w-[calc(100%)] bg-gray-50">
        <main className="flex-1 lg:p-6">{children}</main>
      </div>
      <ErrorDialog />
    </div>
  );
}

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased font-sans-tc`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div>Loading...</div>}>
          <OrganizerLayoutContent>{children}</OrganizerLayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
