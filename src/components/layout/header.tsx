"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import SignInForm from "@/features/auth/components/sign-in-form";
import SignUpForm from "@/features/auth/components/sign-up-form";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useAuthStore } from "@/store/auth";
import { useDialogStore } from "@/store/dialog";
import { Calendar, ChevronLeft, Menu, Settings, SquarePen, Ticket, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const loginDialogOpen = useDialogStore((s) => s.loginDialogOpen);
  const setLoginDialogOpen = useDialogStore((s) => s.setLoginDialogOpen);
  const loginTab = useDialogStore((s) => s.loginTab);
  const setLoginTab = useDialogStore((s) => s.setLoginTab);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const userProfile = useAuthStore((s) => s.userProfile);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAuthOpen, setMobileAuthOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileAuthRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("authRequired") === "true") {
      useDialogStore.getState().setLoginTab("signin");
      useDialogStore.getState().setLoginDialogOpen(true);

      url.searchParams.delete("authRequired");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // 點擊外部關閉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 處理身份驗證表單開啟
  const handleAuthOpen = (tab: "signin" | "signup" | "forgot" | "reset") => {
    if (isMobile) {
      // 手機版: 全螢幕顯示
      setMobileMenuOpen(false);
      setMobileAuthOpen(true);
      setLoginTab(tab);
    } else {
      // 桌面版: 彈窗顯示
      setLoginDialogOpen(true);
      setLoginTab(tab);
    }
  };

  // 當用戶希望切換到另一個認證標籤時的處理程序
  const handleSwitchTab = (tab: "signin" | "signup" | "forgot" | "reset") => {
    setLoginTab(tab);
  };

  // 認證完成後的處理
  const handleAuthSuccess = () => {
    if (isMobile) {
      setMobileAuthOpen(false);
    } else {
      setLoginDialogOpen(false);
    }
  };

  // 生成適當的標題文字
  const getAuthTitle = () => {
    switch (loginTab) {
      case "signin":
        return "會員登入";
      case "signup":
        return "註冊帳號";
      case "forgot":
        return "密碼重設";
      case "reset":
        return "設定新密碼";
      default:
        return "會員登入";
    }
  };

  // 渲染當前選擇的表單
  const renderAuthForm = () => {
    switch (loginTab) {
      case "signin":
        return (
          <SignInForm
            onSuccess={handleAuthSuccess}
            onSwitchTab={handleSwitchTab}
            isMobile={isMobile}
          />
        );
      case "signup":
        return (
          <SignUpForm
            onSuccess={() => handleSwitchTab("signin")}
            onSwitchTab={handleSwitchTab}
            isMobile={isMobile}
          />
        );
      case "forgot":
        return (
          <ForgotPasswordForm
            onSuccess={() => handleSwitchTab("reset")}
            onSwitchTab={handleSwitchTab}
            isMobile={isMobile}
          />
        );
      case "reset":
        return (
          <ResetPasswordForm
            onSuccess={() => handleSwitchTab("signin")}
            onSwitchTab={handleSwitchTab}
            isMobile={isMobile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full bg-white md:bg-[#FFFCF5] px-4 sm:px-8 py-6 flex flex-col items-center z-50 relative mb-10">
      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* 左側選單 */}
        <div className="hidden md:flex flex-1 items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/events"
                    className="font-bold flex flex-row items-center gap-4"
                  >
                    <Ticket className="w-4 h-4 text-neutral-800" />
                    <span className="hidden neutral-800 font-serif-tc sm:inline text-base">
                      探索活動
                    </span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* LOGO */}
        <div className="flex flex-1 justify-center absolute top-0 left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="flex flex-col items-center"
          >
            <span
              className="block rounded-full bg-white md:bg-[#FFFCF5] -mb-2 z-10 p-10"
              title="Eventa Logo"
            >
              <Image
                src="/eventa-logo.svg"
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
        <div className="hidden md:flex flex-1 justify-end items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="px-8 py-2 font-serif-tc font-bold bg-primary-500 hover:saturate-150 duration-200 active:scale-95 cursor-pointer rounded-md mr-8 flex items-center"
              >
                <SquarePen className="w-4 h-4 mr-2" />
                建立活動
              </Link>

              <div
                className="relative"
                ref={menuRef}
              >
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="bg-neutral-800 p-2 rounded-full">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[14px]">{userProfile?.displayName || "使用者"}</p>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-medium text-gray-900">
                        您好，{userProfile?.displayName || "使用者"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">管理您的活動和個人資料</p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/attendee/orders"
                          className="flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Ticket className="w-4 h-4 mr-3 text-gray-500" />
                          訂單管理
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/attendee/profile"
                          className="flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          會員中心
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-500" />
                          帳號管理
                        </Link>
                      </li>
                      <li className="border-t border-gray-100 mt-1">
                        <button
                          type="button"
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                          onClick={() => {
                            logout();
                            router.push("/");
                          }}
                        >
                          登出
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              className="flex items-center gap-1 text-base font-medium hover:underline focus:outline-none"
              onClick={() => handleAuthOpen("signin")}
              type="button"
            >
              <div className="font-serif-tc font-bold flex items-center gap-2 cursor-pointer">
                <User className="w-5 h-5" />
                註冊 / 登入
              </div>
            </button>
          )}
        </div>
        {/* 手機版選單按鈕 */}
        <button
          type="button"
          className="md:hidden flex-1 flex justify-end cursor-pointer"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu />
        </button>
      </div>

      {/* 手機版展開選單 */}
      {mobileMenuOpen && (
        <div
          className="fixed flex flex-col inset-0 bg-white z-50 md:hidden"
          ref={mobileMenuRef}
        >
          <div className="w-full px-4 py-2 flex justify-between items-center">
            <div className="invisible w-10">{/* 空間平衡佔位元素 */}</div>
            <div className="rounded-full bg-white p-6">
              <Image
                src="/eventa-logo.svg"
                alt="Eventa Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <button
              type="button"
              className="p-2 w-10 h-10 flex items-center justify-center cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-5 px-4 flex-grow flex flex-col">
            <div className="flex flex-col gap-4 flex-grow">
              <Link
                href="/events"
                className="flex items-center gap-4 py-2 px-4 font-serif-tc font-black tracking-widest"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Ticket className="w-5 h-5" />
                <span className="text-base">探索活動</span>
              </Link>
              {isAuthenticated ? (
                <Link
                  href="/events/create"
                  className="flex items-center gap-4 py-2 px-4 font-serif-tc font-black text-base tracking-widest"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SquarePen className="w-5 h-5" />
                  <span>建立活動</span>
                </Link>
              ) : (
                <button
                  className="flex items-center gap-4 py-2 px-4 font-serif-tc font-black text-base tracking-widest cursor-pointer"
                  onClick={() => handleAuthOpen("signin")}
                  type="button"
                >
                  <User className="w-5 h-5" />
                  <span>註冊/登入</span>
                </button>
              )}
            </div>

            {isAuthenticated && (
              <div className="">
                <div className="border-t border-gray-200 my-8" />

                <div className="flex items-end justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-800 p-3 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{userProfile?.displayName || "使用者"}</span>
                  </div>
                  <button
                    type="button"
                    className="border border-neutral-400 rounded-lg px-4 py-3 text-xs text-neutral-600 cursor-pointer"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      router.push("/");
                    }}
                  >
                    登出帳號
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 手機版登入/註冊/忘記密碼全屏頁面 */}
      {mobileAuthOpen && isMobile && (
        <div
          className="fixed flex flex-col inset-0 bg-white z-50"
          ref={mobileAuthRef}
        >
          <div className="w-full px-4 py-2 flex justify-between items-center">
            <button
              type="button"
              className="p-2 flex items-center cursor-pointer"
              onClick={() => {
                if (loginTab === "forgot" || loginTab === "signup" || loginTab === "reset") {
                  setLoginTab("signin");
                } else {
                  setMobileAuthOpen(false);
                }
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="rounded-full bg-white p-6">
              <Image
                src="/eventa-logo.svg"
                alt="Eventa Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <button
              type="button"
              className="p-2 w-10 h-10 flex items-center justify-center cursor-pointer"
              onClick={() => setMobileAuthOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col p-6 pt-8">
            <h2 className="text-xl font-bold text-center mb-10">{getAuthTitle()}</h2>

            {renderAuthForm()}
          </div>
        </div>
      )}

      {/* 桌面版彈窗 */}
      {!isMobile && (
        <Dialog
          open={loginDialogOpen}
          onOpenChange={setLoginDialogOpen}
        >
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>{getAuthTitle()}</DialogTitle>
              <DialogDescription>
                {loginTab === "signin" && "請輸入您的帳號密碼進行登入"}
                {loginTab === "signup" && "請填寫以下資料完成註冊"}
                {loginTab === "forgot" && "請輸入您的電子郵件，我們將發送重設密碼連結"}
                {loginTab === "reset" && "請輸入您的新密碼"}
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">{renderAuthForm()}</div>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
}
