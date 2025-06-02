"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  QrCode,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  // 假資料
  const ticket = {
    id: "12312313123878",
    name: "一般票",
    price: 1000,
    status: "已分票",
    assignedUserId: 2,
    assignedEmail: "test@gmail.com",
    assignedName: "test",
    refundDeadline: "2025-09-02 13:00",
    startTime: "2025-09-10 13:00",
    endTime: "2025-09-10 15:00",
    order: {
      id: "2307281011564244710900",
      method: "信用卡",
      status: "已付款",
      paidAt: "2025-04-20 18:00",
    },
    activity: {
      id: 1456789,
      title: "藝術市集：創意手作與在地文創展覽",
      summary: "全台最盛大的戶外音樂祭！結合親子、野餐、星空與搖滾，讓你在仲夏夜盡情狂歡！",
      location: "苗栗縣大埔鄉東正路121巷8弄20號",
      link: "https://www.google.com",
      startTime: "2025-04-19T14:30:00+08:00",
      endTime: "2025-05-10T20:30:00+08:00",
      notes:
        "導航至「心靈山水藝術保護區」，當日以接駁車前往！由於園區內停車位有限，建議大家「共乘入園」，感謝配合。",
    },
    organizer: {
      id: 123,
      name: "Eventa官方",
      phoneNumber: "07-3123444",
      countryCode: "+886",
      ext: "2513",
      email: "eventa.official@eventa.com",
      officialSiteUrl: "http://www.eventa.com",
    },
  };
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 py-16 md:pb-[200px]">
      <div className="mx-auto max-w-2xl">
        {/* Main Ticket Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-900 p-6">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-3xl font-bold leading-tight">
                {ticket.activity.title}
              </h1>

              <Badge className="text-neutral-900 w-fit text-lg md:text-2xl font-bold md:py-1">
                一般票
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Event Details */}
            <div className="p-6 space-y-6">
              {/* Date & Time */}
              <div className="sm:flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 md:text-lg">活動日期</h3>
                  <p className="text-gray-700 md:text-lg">
                    {format(new Date(ticket.activity.startTime), "yyyy.MM.dd")}（
                    {format(new Date(ticket.activity.startTime), "EEEE", { locale: zhTW }).replace(
                      "星期",
                      ""
                    )}
                    ）{format(new Date(ticket.activity.startTime), "HH:mm")} -{" "}
                    {format(new Date(ticket.activity.endTime), "yyyy.MM.dd")}（
                    {format(new Date(ticket.activity.endTime), "EEEE", { locale: zhTW }).replace(
                      "星期",
                      ""
                    )}
                    ）{format(new Date(ticket.activity.endTime), "HH:mm")} (GMT+8)
                  </p>
                </div>
              </div>

              {/* Location */}
              {ticket.activity.location && (
                <div className="sm:flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 md:text-lg">活動地點</h3>
                    <p className="text-gray-700 md:text-lg mb-2">{ticket.activity.location}</p>
                    <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-3">
                      <p className="text-secondary-800 text-sm leading-relaxed">
                        {ticket.activity.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Activity Link */}
              {ticket.activity.link && (
                <div className="sm:flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                    <LinkIcon className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 md:text-lg">活動連結</h3>
                    <Link
                      href={ticket.activity.link}
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ticket.activity.link}
                    </Link>
                  </div>
                </div>
              )}

              {/* Event Hours */}
              <div className="sm:flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3 md:text-lg">開放時間</h3>
                  <div className="bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-neutral-600">
                          {format(new Date(ticket.activity.startTime), "HH:mm")}
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                          {format(new Date(ticket.activity.startTime), "yyyy-MM-dd")}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">開始</div>
                      </div>
                      <div className="flex items-center w-full md:w-1/4">
                        <div className="w-full h-0.5 bg-neutral-300" />
                        <div className="w-2 h-2 bg-neutral-400 rounded-full mx-1 flex-shrink-0" />
                        <div className="w-full h-0.5 bg-neutral-300" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-neutral-600">
                          {format(new Date(ticket.activity.endTime), "HH:mm")}
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                          {format(new Date(ticket.activity.endTime), "yyyy-MM-dd")}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">結束</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* QR Code Section */}
            <div className="p-6 bg-gray-50">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <QrCode className="h-5 w-5" />
                  <span className="font-semibold md:text-lg">入場憑證</span>
                </div>

                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
                    <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                      <QrCode className="h-20 w-20 text-gray-400" />
                    </div>
                  </div>
                </div>
                <Button className="w-full py-6 text-base md:text-lg">報到</Button>
                <p className="text-sm text-gray-500 text-center">僅供活動工作人員確認入場</p>

                <div className="space-y-2 bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-800 md:text-lg">參加者</span>
                    <span className="font-semibold text-neutral-800 md:text-lg">
                      {ticket.assignedName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-800 md:text-lg">票券編號</span>
                    <span className="font-semibold text-neutral-800 md:text-lg">{ticketId}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Collapsible Sections */}
            <div className="p-6 space-y-3">
              {/* Booking Details */}
              <Collapsible
                open={expandedSections.booking}
                onOpenChange={() => toggleSection("booking")}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="font-medium text-neutral-900 md:text-lg">訂票明細</span>
                    {expandedSections.booking ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 bg-white border border-gray-100 rounded-lg mt-2">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">票券類型</span>
                        <span className="font-semibold text-neutral-800 md:text-lg">
                          {ticket.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">金額</span>
                        <span className="font-semibold text-neutral-800 md:text-lg">
                          NT$ {ticket.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">訂票時間</span>
                        <span className="font-semibold text-neutral-800 md:text-lg">
                          {format(new Date(ticket.order.paidAt), "yyyy-MM-dd HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Participant Info */}
              <Collapsible
                open={expandedSections.participant}
                onOpenChange={() => toggleSection("participant")}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="font-medium text-neutral-900 md:text-lg">參加者資訊</span>
                    {expandedSections.participant ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 bg-white border border-gray-100 rounded-lg mt-2">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">姓名</span>
                        <span className="font-semibold text-neutral-800 md:text-lg">
                          {ticket.assignedName}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 md:h-6 md:w-6 text-neutral-500" />
                        <div>
                          <div className="text-xs text-neutral-800">聯絡電話</div>
                          <div className="font-medium text-neutral-800 text-lg">{ticket.organizer.phoneNumber}</div>
                        </div>
                      </div> */}
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">電子郵件</span>
                        <span className="font-semibold text-neutral-800 md:text-lg">
                          {ticket.assignedEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Contact Organizer */}
              <Collapsible
                open={expandedSections.contact}
                onOpenChange={() => toggleSection("contact")}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="font-medium text-neutral-900 md:text-lg">聯絡主辦單位</span>
                    {expandedSections.contact ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 bg-white border border-gray-100 rounded-lg mt-2">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">主辦單位</span>
                        <span className="font-semibold text-neutral-800 md:text-lg">
                          {ticket.organizer.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">聯絡電話</span>
                        <Link
                          href={`tel:${ticket.organizer.phoneNumber}`}
                          className="font-semibold text-neutral-800 md:text-lg"
                        >
                          {ticket.organizer.phoneNumber}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">電子郵件</span>
                        <Link
                          href={`mailto:${ticket.organizer.email}`}
                          className="font-semibold text-neutral-800 md:text-lg"
                        >
                          {ticket.organizer.email}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">網站</span>
                        <Link
                          href={ticket.organizer.officialSiteUrl}
                          className="font-semibold text-neutral-800 md:text-lg"
                        >
                          {ticket.organizer.officialSiteUrl}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Important Notes */}
              <Collapsible
                open={expandedSections.notes}
                onOpenChange={() => toggleSection("notes")}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="font-medium text-neutral-900 md:text-lg">注意事項</span>
                    {expandedSections.notes ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 bg-white border border-gray-100 rounded-lg mt-2">
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-secondary-600 flex-shrink-0 mt-1" />
                          <p className="text-secondary-800 leading-relaxed">
                            Eventa
                            為活動刊登及票券交易之公開平台，活動舉辦由主辦單位全權負責，主辦單位保有最後活動調整與解釋的權利。
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-base md:text-lg">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
                          <span>請於活動當日攜帶此票券入場</span>
                        </li>
                        {ticket.activity.location && (
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
                            <span>線下活動如遇天候不佳將另行通知</span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
                          <span>禁止攜帶危險物品入場</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
