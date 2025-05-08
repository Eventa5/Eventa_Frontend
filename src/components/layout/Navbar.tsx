"use client";
import SignInForm from "@/components/layout/SignInForm";
import SignUpForm from "@/components/layout/SignUpForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/lib/auth";
import { SquarePen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const { isAuthenticated } = useAuth();
  return (
    <nav className="w-full bg-white md:bg-[#FFFCF5] px-4 sm:px-8 py-6 flex flex-col items-center z-50 mb-10">
      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* 左側選單 */}
        <div className="flex-1 flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/events"
                    className="font-bold flex items-center gap-1 text-base"
                  >
                    <span className="hidden sm:inline">探索活動</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* LOGO */}
        <div className="flex-1 flex justify-center absolute top-0 left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="flex flex-col items-center"
          >
            <span
              className="block rounded-b-full bg-white md:bg-[#FFFCF5] -mb-2 z-10 p-10"
              title="Eventa Logo"
            >
              <Image
                src="/Eventa_logo.svg"
                alt="Eventa Logo Balloon and Ticket"
                width={80}
                height={80}
                className="w-14 h-14 sm:w-20 sm:h-20"
                priority
              />
            </span>
            <span className="font-black text-lg tracking-widest -mt-2 text-transparent">
              EVENTA
            </span>
          </Link>
        </div>
        {/* 右側登入/註冊 */}
        <div className="flex-1 flex justify-end items-center">
          {isAuthenticated ? (
            <Link
              href="/attendee/profile"
              className="flex items-center gap-1 text-base font-medium hover:underline focus:outline-none"
            >
              <span className="hidden sm:inline">建立活動</span>
              <span className="sm:hidden">
                <SquarePen className="w-4 h-4" />
              </span>
            </Link>
          ) : (
            <button
              className="flex items-center gap-1 text-base font-medium hover:underline focus:outline-none"
              onClick={() => {
                setOpen(true);
                setTab("signin");
              }}
              type="button"
            >
              <span className="hidden sm:inline">註冊/登入</span>
              <span className="sm:hidden">
                <User className="w-4 h-4" />
              </span>
            </button>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>{tab === "signin" ? "登入" : "註冊"}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {tab === "signin" ? (
              <>
                <SignInForm onSuccess={() => setOpen(false)} />
                <div className="text-center mt-4 text-sm">
                  還沒有 Eventa 帳號嗎？
                  <button
                    className="text-[var(--color-primary-600)] font-bold underline ml-1"
                    type="button"
                    onClick={() => setTab("signup")}
                  >
                    前往註冊
                  </button>
                </div>
              </>
            ) : (
              <>
                <SignUpForm onSuccess={() => setTab("signin")} />
                <div className="text-center mt-4 text-sm">
                  已經有 Eventa 帳號了嗎？
                  <button
                    className="text-[var(--color-primary-600)] font-bold underline ml-1"
                    type="button"
                    onClick={() => setTab("signin")}
                  >
                    前往登入
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
