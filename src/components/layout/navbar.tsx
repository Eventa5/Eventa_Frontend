"use client";

import SelectOrganizerDialog from "@/features/organizer/components/select-organizer-dialog";
import { useAuthStore } from "@/store/auth";
import { useOrganizerStore } from "@/store/organizer";
import { Home, House, LogOut, SwitchCamera, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const clearCurrentOrganizer = useOrganizerStore((s) => s.clearCurrentOrganizer);
  const currentOrganizerInfo = useOrganizerStore((s) => s.currentOrganizerInfo);

  // 處理選擇主辦單位成功
  const handleOrganizerSelected = () => {
    setMenuOpen(false);
    router.push("/organizer");
  };

  return (
    <div className="w-full bg-primary-50 md:bg-white py-4 flex justify-end items-center px-6 z-50 sticky lg:relative top-0 lg:top-auto">
      <div className="w-full flex items-center justify-between lg:justify-end gap-8">
        <div className="w-9" />

        <Link
          href="/organizer"
          className="lg:hidden"
        >
          <Image
            src="/eventa-logo-horizontal.svg"
            alt="Eventa Logo Balloon and Ticket"
            width={120}
            height={37}
          />
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
            <div className="bg-[#262626] rounded-full">
              {currentOrganizerInfo?.avatar ? (
                <Image
                  src={currentOrganizerInfo.avatar}
                  alt="Organizer Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <UserRound className="w-8 h-8 text-white" />
              )}
            </div>
            <span className="text-sm font-normal text-[#262626] hidden lg:block">
              {currentOrganizerInfo?.name || "使用者"}
            </span>
          </button>

          {menuOpen && (
            <>
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-900">
                    您好，{currentOrganizerInfo?.name || "使用者"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">管理您的活動和平台</p>
                </div>
                <ul className="py-2">
                  <li>
                    <Link
                      href="/organizer"
                      className="flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Home className="w-4 h-4 mr-3 text-gray-500" />
                      主辦中心
                    </Link>
                  </li>
                  <li>
                    <SelectOrganizerDialog onSuccess={handleOrganizerSelected}>
                      <button
                        type="button"
                        className="flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <SwitchCamera className="w-4 h-4 mr-3 text-gray-500" />
                        切換主辦中心
                      </button>
                    </SelectOrganizerDialog>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <House className="w-4 h-4 mr-3 text-gray-500" />
                      回首頁
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 mt-1">
                    <button
                      type="button"
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        logout();
                        clearCurrentOrganizer();
                        router.push("/");
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-500" />
                      登出
                    </button>
                  </li>
                </ul>
              </div>
              <div
                className="fixed top-0 left-0 w-full h-full z-40"
                onClick={() => setMenuOpen(false)}
              />
            </>
          )}
        </div>

        <Link
          href="/create-event/organizer"
          className="px-8 py-2 font-bold bg-primary-500 hover:saturate-150 duration-200 active:scale-95 cursor-pointer rounded-md mr-8 items-center hidden lg:flex"
        >
          建立活動
        </Link>
      </div>
    </div>
  );
};
