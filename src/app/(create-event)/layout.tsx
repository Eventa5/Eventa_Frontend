import localFont from "next/font/local";
import "@/styles/globals.css";

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
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased font-sans-tc`}
        suppressHydrationWarning
      >
        <div className="flex flex-col h-screen">
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
