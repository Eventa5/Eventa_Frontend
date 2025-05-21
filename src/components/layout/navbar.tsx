"use client";

import { useAuthStore } from "@/store/auth";
import { Home, LogOut, SwitchCamera, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const createEvent = () => {
    router.push(`/create-event/${Math.random().toString(36).slice(2)}/basicinfo`);
  };

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

  return (
    <div className="w-full bg-[#FDFBF5] py-4 flex justify-end items-center px-6">
      <div className="flex items-center gap-8">
        <div
          className="relative"
          ref={menuRef}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-[#262626] p-2 rounded-full">
              <UserRound className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-normal text-[#262626]">使用者#001</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <p className="font-medium text-gray-900">您好，使用者</p>
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
                  <button
                    type="button"
                    className="flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                  >
                    <SwitchCamera className="w-4 h-4 mr-3 text-gray-500" />
                    切換主辦中心
                  </button>
                </li>
                <li className="border-t border-gray-100 mt-1">
                  <button
                    type="button"
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-3 text-red-500" />
                    登出
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={createEvent}
          className="bg-[#FFD56B] text-[#262626] rounded-xl px-8 py-2 text-base font-normal hover:bg-[#FFCA28] transition-colors cursor-pointer"
        >
          建立活動
        </Button>
      </div>
    </div>
  );
};
