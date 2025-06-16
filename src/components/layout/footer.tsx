"use client";

import HelpButton from "@/features/chatbot/components/help-button";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 團隊成員資料
type TeamMember = {
  id: string;
  name: string;
  githubUrl?: string;
};

const teamMembers: TeamMember[] = [
  { id: "hsinyu", name: "Hsin Yu", githubUrl: "https://github.com/dogwantfly" },
  { id: "kim", name: "Kim", githubUrl: "https://github.com/kim1037" },
  { id: "jill", name: "Jill", githubUrl: "https://github.com/nakwaaa" },
  {
    id: "kai",
    name: "Kai",
    githubUrl: "https://github.com/Beginneraboutlife116",
  },
  { id: "thomas", name: "Thomas", githubUrl: "https://github.com/th1230" },
];

// 探索活動連結
type FooterLink = {
  id: string;
  href: string;
  label: string;
};

const exploreLinks: FooterLink[] = [
  { id: "featured", href: "/events", label: "精選活動" },
  { id: "learning", href: "/events?categoryId=2", label: "學習活動" },
  { id: "arts", href: "/events?categoryId=10", label: "藝文活動" },
  { id: "experience", href: "/events?categoryId=1", label: "戶外體驗活動" },
  // {
  //   id: "ai-recommended",
  //   href: "/events?categoryId=ai-recommended",
  //   label: "AI 為您推薦",
  // },
  { id: "faq", href: "/faq", label: "常見問題" },
];

// 舉辦活動連結
const hostLinks: FooterLink[] = [
  { id: "register", href: "/host/register", label: "成為活動主辦人" },
  { id: "online", href: "/host/guidelines/online", label: "線上活動規範" },
  { id: "offline", href: "/host/guidelines/offline", label: "線下活動規範" },
  { id: "hostfaq", href: "/host/faq", label: "常見問題" },
];

// 社交媒體圖示元件
const SocialIcon = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label?: string;
}) => (
  <div className="bg-[#3C3C3C] rounded-md w-fit px-2 py-1 flex items-center justify-center cursor-pointer hover:bg-[#FFFFFF] hover:text-[#3C3C3C] transition-all duration-200">
    {icon}
    {label && <p className="text-[14px]">{label}</p>}
  </div>
);

// 團隊成員卡片元件
const TeamMemberCard = ({ member }: { member: TeamMember }) => (
  <div className="grid grid-cols-[71px_1fr] gap-4">
    <p>{member.name}</p>
    {member.githubUrl && (
      <div className="flex items-center gap-2">
        <Link
          href={member.githubUrl}
          target="_blank"
        >
          <SocialIcon icon={<Github className="w-4 h-4" />} />
        </Link>
      </div>
    )}
  </div>
);

// 頁尾連結區塊元件
const FooterLinkSection = ({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) => (
  <div className="flex flex-col gap-6">
    <h3 className="font-bold text-lg text-[#737373]">{title}</h3>
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className="text-white hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-[#262626] text-white py-24 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-12">
          {/* Logo 區域 */}
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <div className="relative">
              <Image
                src="/eventa-logo-white.svg"
                alt="Eventa Logo"
                width={101}
                height={100}
              />
            </div>
          </div>

          {/* 關於我們 */}
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-lg text-[#737373]">關於我們</h3>
            <div className="flex flex-col gap-2">
              {teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                />
              ))}
            </div>
          </div>

          {/* 探索活動 */}
          <FooterLinkSection
            title="探索活動"
            links={exploreLinks}
          />

          {/* 舉辦活動 */}
          <FooterLinkSection
            title="舉辦活動"
            links={hostLinks}
          />

          {/* 客服中心 */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-[#737373] mb-2">客服中心</h3>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-white">Email</span>
                <span className="text-white">projecteventa@gmail.com</span>
              </div>
              <p className="text-white">週一至週五 10:00 - 18:30</p>
            </div>
            <HelpButton />
          </div>
        </div>
      </div>

      {/* 版權聲明 */}
      <div className="bg-black text-center py-4">
        <p className="text-white text-sm font-light tracking-wider">
          © Copyright 2025 EVENTA. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
