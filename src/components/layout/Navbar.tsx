"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import SignInForm from "@/features/auth/components/SignInForm";
import SignUpForm from "@/features/auth/components/SignUpForm";
import { useAuthStore } from "@/store/auth";
import { useDialogStore } from "@/store/dialog";
import { SquarePen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const loginDialogOpen = useDialogStore((s) => s.loginDialogOpen);
  const setLoginDialogOpen = useDialogStore((s) => s.setLoginDialogOpen);
  const loginTab = useDialogStore((s) => s.loginTab);
  const setLoginTab = useDialogStore((s) => s.setLoginTab);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("authRequired") === "true") {
      useDialogStore.getState().setLoginTab("signin");
      useDialogStore.getState().setLoginDialogOpen(true);

      url.searchParams.delete("authRequired");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

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
            <div className="flex items-center gap-2">
              <Link
                href="/attendee/profile"
                className="flex items-center gap-1 text-base font-medium hover:underline focus:outline-none"
              >
                <span className="hidden sm:inline">會員中心</span>
                <span className="sm:hidden">
                  <SquarePen className="w-4 h-4" />
                </span>
              </Link>
              <button
                className="flex items-center gap-1 text-base font-medium hover:underline focus:outline-none text-red-500"
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                登出
              </button>
            </div>
          ) : (
            <button
              className="flex items-center gap-1 text-base font-medium hover:underline focus:outline-none"
              onClick={() => {
                setLoginDialogOpen(true);
                setLoginTab("signin");
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
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      >
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>{loginTab === "signin" ? "登入" : "註冊"}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {loginTab === "signin" ? (
              <>
                <SignInForm onSuccess={() => setLoginDialogOpen(false)} />
                <div className="text-center mt-4 text-sm">
                  還沒有 Eventa 帳號嗎？
                  <button
                    className="text-[var(--color-primary-600)] font-bold underline ml-1"
                    type="button"
                    onClick={() => setLoginTab("signup")}
                  >
                    前往註冊
                  </button>
                </div>
              </>
            ) : (
              <>
                <SignUpForm onSuccess={() => setLoginTab("signin")} />
                <div className="text-center mt-4 text-sm">
                  已經有 Eventa 帳號了嗎？
                  <button
                    className="text-[var(--color-primary-600)] font-bold underline ml-1"
                    type="button"
                    onClick={() => setLoginTab("signin")}
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
