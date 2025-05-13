import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "個人檔案",
  description: "會員個人檔案",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
