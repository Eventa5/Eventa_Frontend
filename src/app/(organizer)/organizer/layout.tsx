import localFont from "next/font/local";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import ErrorDialog from "@/components/ui/error-dialog";
import { Toaster } from "@/components/ui/sonner";
import { InitOrganizerState } from "@/features/organizer/components/InitOrganizerState";
import { getApiV1Organizations } from "@/services/api/client/sdk.gen";
import type { Viewport } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const dynamic = "force-dynamic";

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
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col w-[calc(100%)] lg:pl-[220px]">
        <Navbar />
        <main className="flex-1 lg:p-6 lg:pt-0">{children}</main>
      </div>
      <ErrorDialog />
      <Toaster />
    </div>
  );
}

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await getApiV1Organizations();
  if (!response.data?.data?.length) {
    redirect("/create");
  }
  const defaultOrg = response.data?.data[0];

  return (
    <html lang="zh-TW">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased font-sans-tc`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div>Loading...</div>}>
          <InitOrganizerState orgId={defaultOrg.id || -1}>
            <OrganizerLayoutContent>{children}</OrganizerLayoutContent>
          </InitOrganizerState>
        </Suspense>
      </body>
    </html>
  );
}
