"use client";

import { cn } from "@/utils/transformer";
import { ChevronLeft, Gauge, LayoutDashboard, PenSquare, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  subItems?: SubNavItemProps[];
  isSubMenuOpen?: boolean;
  onToggleSubMenu?: () => void;
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
}) => {
  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div className="flex flex-col w-full">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg transition-colors",
          isActive ? "bg-[#FFE6A6] text-[#262626]" : "hover:bg-[#FFEEC4] text-[#262626]"
        )}
        onClick={
          hasSubItems
            ? (e) => {
                e.preventDefault();
                onToggleSubMenu?.();
              }
            : undefined
        }
      >
        {icon}
        <span>{label}</span>
      </Link>

      {hasSubItems && isSubMenuOpen && (
        <div className="flex flex-col pl-8 mt-2 space-y-2">
          {subItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm py-1",
                item.isActive
                  ? "text-[#525252] font-semibold"
                  : "text-[#737373] hover:text-[#525252]"
              )}
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
  const params = useParams();
  const eventId = params?.eventId as string | undefined;

  const [openSubMenus, setOpenSubMenus] = React.useState<{
    edit?: boolean;
    tickets?: boolean;
  }>({
    edit: true,
    tickets: true,
  });

  const toggleSubMenu = (menu: "edit" | "tickets") => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // 圖標組件替換為Lucide圖標
  const DashboardIcon = () => <Gauge className="w-5 h-5" />;
  const EventsIcon = () => <LayoutDashboard className="w-5 h-5" />;
  const EditIcon = () => <PenSquare className="w-5 h-5" />;
  const TicketIcon = () => <Ticket className="w-5 h-5" />;
  const BackIcon = () => <ChevronLeft className="w-5 h-5" />;

  // 判斷當前路徑
  const isInEditMode = eventId && pathname.includes(`/organizer/events/${eventId}/edit`);
  const isInTicketsSection = eventId && pathname.includes(`/organizer/events/${eventId}/ticket`);

  if (!eventId) {
    // 組織者主頁模式
    return (
      <div className="w-[220px] p-6 h-full bg-[#FDFBF5] flex flex-col gap-14">
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
    );
  }

  // 活動詳情模式
  return (
    <div className="w-[220px] p-6 h-full bg-[#FDFBF5] flex flex-col gap-14">
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
        />{" "}
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
  );
};
