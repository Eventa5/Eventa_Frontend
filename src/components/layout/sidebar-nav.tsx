"use client";

import { useAuthStore } from "@/store/auth";
import { cn } from "@/utils/transformer";
import {
  ChevronLeft,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  PenSquare,
  Ticket,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { Button } from "../ui/button";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  subItems?: SubNavItemProps[];
  isSubMenuOpen?: boolean;
  onToggleSubMenu?: () => void;
  isMobile?: boolean;
  onMobileNavClose?: () => void;
}

interface SubNavItemProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isActive,
  subItems,
  isSubMenuOpen,
  onToggleSubMenu,
  isMobile = false,
  onMobileNavClose,
}) => {
  const hasSubItems = subItems && subItems.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      onToggleSubMenu?.();
    } else if (isMobile) {
      onMobileNavClose?.();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg transition-colors",
          isMobile ? "py-4 px-4 text-base" : "",
          isActive ? "bg-[#FFE6A6] text-[#262626]" : "hover:bg-[#FFEEC4] text-[#262626]"
        )}
        onClick={handleClick}
      >
        {icon}
        <span>{label}</span>
      </Link>

      {hasSubItems && isSubMenuOpen && (
        <div className={cn("flex flex-col mt-2 space-y-2", isMobile ? "pl-6" : "pl-8")}>
          {subItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm py-1",
                isMobile ? "py-3 px-4 text-base" : "",
                item.isActive
                  ? "text-[#525252] font-semibold"
                  : "text-[#737373] hover:text-[#525252]"
              )}
              onClick={isMobile ? onMobileNavClose : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const SidebarNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string | undefined;
  const logout = useAuthStore((s) => s.logout);

  const [openSubMenus, setOpenSubMenus] = React.useState<{
    edit?: boolean;
    tickets?: boolean;
  }>({
    edit: false,
    tickets: false,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleSubMenu = (menu: "edit" | "tickets") => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  // 控制body滾動
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // 點擊外部關閉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // 圖標組件替換為Lucide圖標
  const DashboardIcon = () => <Gauge className="w-5 h-5" />;
  const EventsIcon = () => <LayoutDashboard className="w-5 h-5" />;
  const EditIcon = () => <PenSquare className="w-5 h-5" />;
  const TicketIcon = () => <Ticket className="w-5 h-5" />;
  const BackIcon = () => <ChevronLeft className="w-5 h-5" />;
  const MenuIcon = () => <Menu className="w-6 h-6" />;
  const CloseIcon = () => <X className="w-6 h-6" />;

  // 手機版漢堡選單按鈕
  const MobileMenuButton = () => (
    <div className="lg:hidden fixed top-5 left-7 z-50">
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="bg-white rounded-lg cursor-pointer"
      >
        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
    </div>
  );

  // 手機版選單
  const MobileMenu = () => (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-white z-50 lg:hidden flex flex-col mt-[68px] p-4"
          ref={mobileMenuRef}
        >
          {/* 選單內容 */}
          <div className="flex-1 overflow-y-auto py-6 px-4 mb-4">
            <div className="flex flex-col space-y-4 w-full">
              {!eventId ? (
                // 組織者主頁模式
                <>
                  <NavItem
                    href="/organizer"
                    icon={<DashboardIcon />}
                    label="總覽"
                    isActive={pathname === "/organizer"}
                    isMobile={true}
                    onMobileNavClose={closeMobileMenu}
                  />
                  <NavItem
                    href="/organizer/events"
                    icon={<EventsIcon />}
                    label="活動列表"
                    isActive={pathname === "/organizer/events"}
                    isMobile={true}
                    onMobileNavClose={closeMobileMenu}
                  />
                </>
              ) : (
                // 活動詳情模式
                <>
                  <NavItem
                    href="/organizer/events"
                    icon={<BackIcon />}
                    label="活動列表"
                    isActive={false}
                    isMobile={true}
                    onMobileNavClose={closeMobileMenu}
                  />
                  <NavItem
                    href={`/organizer/events/${eventId}/edit/basicinfo`}
                    icon={<EditIcon />}
                    label="編輯活動"
                    isActive={pathname.includes(`/organizer/events/${eventId}/edit`)}
                    isSubMenuOpen={openSubMenus.edit}
                    onToggleSubMenu={() => toggleSubMenu("edit")}
                    isMobile={true}
                    onMobileNavClose={closeMobileMenu}
                    subItems={[
                      {
                        href: `/organizer/events/${eventId}/edit/basicinfo`,
                        label: "基本資訊",
                        isActive: pathname.includes("/edit/basicinfo"),
                      },
                      {
                        href: `/organizer/events/${eventId}/edit/eventplacetype`,
                        label: "形式",
                        isActive: pathname.includes("/edit/eventplacetype"),
                      },
                      {
                        href: `/organizer/events/${eventId}/edit/category`,
                        label: "主題",
                        isActive: pathname.includes("/edit/category"),
                      },
                      {
                        href: `/organizer/events/${eventId}/edit/intro`,
                        label: "活動內容",
                        isActive: pathname.includes("/edit/intro"),
                      },
                      {
                        href: `/organizer/events/${eventId}/edit/tickets/setting`,
                        label: "票券設定",
                        isActive: pathname.includes("/edit/tickets/setting"),
                      },
                      {
                        href: `/organizer/events/${eventId}/edit/tickets/advanced`,
                        label: "進階設定",
                        isActive: pathname.includes("/edit/tickets/advanced"),
                      },
                    ]}
                  />
                  <NavItem
                    href={`/organizer/events/${eventId}/ticket/sales`}
                    icon={<TicketIcon />}
                    label="票券"
                    isActive={pathname.includes(`/organizer/events/${eventId}/ticket`)}
                    isSubMenuOpen={openSubMenus.tickets}
                    onToggleSubMenu={() => toggleSubMenu("tickets")}
                    isMobile={true}
                    onMobileNavClose={closeMobileMenu}
                    subItems={[
                      {
                        href: `/organizer/events/${eventId}/ticket/sales`,
                        label: "售票狀況",
                        isActive: pathname.includes("/ticket/sales"),
                      },
                      {
                        href: `/organizer/events/${eventId}/ticket/checkin`,
                        label: "報到狀況",
                        isActive: pathname.includes("/ticket/checkin"),
                      },
                    ]}
                  />
                </>
              )}
            </div>
          </div>

          <Link
            href="/create-event/organizer"
            className="px-8 py-2 font-bold bg-primary-500 hover:saturate-150 duration-200 active:scale-95 cursor-pointer rounded-md mr-8 justify-center items-center flex w-full"
          >
            建立活動
          </Link>

          <div className="w-full flex items-center justify-between px-4 py-4 mt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-neutral-800 p-3 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">使用者#001</span>
            </div>
            <button
              type="button"
              className="flex items-center text-left px-4 py-3 text-sm text-neutral-600 border border-neutral-600 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              登出帳號
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (!eventId) {
    // 組織者主頁模式
    return (
      <>
        <MobileMenuButton />
        <MobileMenu />
        <div className="hidden lg:flex w-[220px] shrink-0 p-6 h-full bg-[#FDFBF5] flex-col gap-14">
          <div className="flex justify-center">
            <Link href="/organizer">
              <Image
                src="/eventa-logo-horizontal.svg"
                alt="Eventa"
                width={145}
                height={44}
                className="w-auto"
              />
            </Link>
          </div>

          <div className="flex flex-col space-y-4 w-full">
            <NavItem
              href="/organizer"
              icon={<DashboardIcon />}
              label="總覽"
              isActive={pathname === "/organizer"}
            />
            <NavItem
              href="/organizer/events"
              icon={<EventsIcon />}
              label="活動列表"
              isActive={pathname === "/organizer/events"}
            />
          </div>
        </div>
      </>
    );
  }

  // 活動詳情模式
  return (
    <>
      <MobileMenuButton />
      <MobileMenu />
      <div className="hidden md:flex w-[220px] p-6 h-full bg-[#FDFBF5] flex-col gap-14">
        <div className="flex justify-center">
          <Link href="/organizer">
            <Image
              src="/eventa-logo.svg"
              alt="Eventa"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-col space-y-4 w-full">
          <NavItem
            href="/organizer/events"
            icon={<BackIcon />}
            label="活動列表"
            isActive={false}
          />
          <NavItem
            href={`/organizer/events/${eventId}/edit/basicinfo`}
            icon={<EditIcon />}
            label="編輯活動"
            isActive={pathname.includes(`/organizer/events/${eventId}/edit`)}
            isSubMenuOpen={openSubMenus.edit}
            onToggleSubMenu={() => toggleSubMenu("edit")}
            subItems={[
              {
                href: `/organizer/events/${eventId}/edit/basicinfo`,
                label: "基本資訊",
                isActive: pathname.includes("/edit/basicinfo"),
              },
              {
                href: `/organizer/events/${eventId}/edit/eventplacetype`,
                label: "形式",
                isActive: pathname.includes("/edit/eventplacetype"),
              },
              {
                href: `/organizer/events/${eventId}/edit/category`,
                label: "主題",
                isActive: pathname.includes("/edit/category"),
              },
              {
                href: `/organizer/events/${eventId}/edit/intro`,
                label: "活動內容",
                isActive: pathname.includes("/edit/intro"),
              },
              {
                href: `/organizer/events/${eventId}/edit/tickets/setting`,
                label: "票券設定",
                isActive: pathname.includes("/edit/tickets/setting"),
              },
              {
                href: `/organizer/events/${eventId}/edit/tickets/advanced`,
                label: "進階設定",
                isActive: pathname.includes("/edit/tickets/advanced"),
              },
            ]}
          />
          <NavItem
            href={`/organizer/events/${eventId}/ticket/sales`}
            icon={<TicketIcon />}
            label="票券"
            isActive={pathname.includes(`/organizer/events/${eventId}/ticket`)}
            isSubMenuOpen={openSubMenus.tickets}
            onToggleSubMenu={() => toggleSubMenu("tickets")}
            subItems={[
              {
                href: `/organizer/events/${eventId}/ticket/sales`,
                label: "售票狀況",
                isActive: pathname.includes("/ticket/sales"),
              },
              {
                href: `/organizer/events/${eventId}/ticket/checkin`,
                label: "報到狀況",
                isActive: pathname.includes("/ticket/checkin"),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};
