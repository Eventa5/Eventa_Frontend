"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEventDate } from "@/features/activities/formatEventDate";
import { getApiV1TicketsByTicketId, getApiV1UsersProfile } from "@/services/api/client/sdk.gen";
import type { TicketDetailResponse } from "@/services/api/client/types.gen";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Link as LinkIcon,
  Loader,
  Mail,
  MapPin,
  Phone,
  QrCode,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import useSWR from "swr";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const {
    data: ticketData,
    error,
    isLoading,
  } = useSWR(ticketId ? `/api/v1/tickets/${ticketId}` : null, () =>
    getApiV1TicketsByTicketId({ path: { ticketId: ticketId as string } })
  );

  const profileFetcher = async () => {
    const response = await getApiV1UsersProfile();
    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.error?.message || "無法獲取個人資料");
  };
  const { data: userProfile } = useSWR("/api/v1/users/profile", profileFetcher);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto p-4 py-16 md:pb-[200px]">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-900 p-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="sm:flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="sm:flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="sm:flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (ticketData?.error || !ticketData?.data) {
    return (
      <div className="container max-w-6xl mx-auto p-4 py-16 md:pb-[200px]">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-center text-red-500">
                <AlertCircle className="h-6 w-6 mr-2" />
                <span>{ticketData?.error?.message ?? "載入失敗，請稍後再試"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const ticket = ticketData.data.data as TicketDetailResponse;

  if (!ticket) {
    return (
      <div className="container max-w-6xl mx-auto p-4 py-16 md:pb-[200px]">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-center text-red-500">
                <AlertCircle className="h-6 w-6 mr-2" />
                <span>找不到票券資料</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 pb-16 pt-10 md:pb-[200px]">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/attendee/orders">訂單管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/attendee/orders/${ticket.order?.id}`}
            >{`訂單詳情（${ticket.order?.id}）`}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{`票券詳情（${ticket.id}）`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mx-auto max-w-2xl">
        {/* Main Ticket Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-900 p-6">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-3xl font-bold leading-tight">
                {ticket.activity?.title}
              </h1>

              <Badge
                className="text-neutral-900 w-fit text-lg md:text-2xl font-bold md:py-1"
                variant={ticket.status === "used" ? "outline" : "default"}
              >
                {ticket.status === "used" ? "已使用" : ticket.name}
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
                    {ticket?.activity?.startTime && ticket?.activity?.endTime && (
                      <span className="whitespace-pre-line">
                        {(() => {
                          const date = formatEventDate(
                            ticket.activity.startTime,
                            ticket.activity.endTime
                          );
                          return date.isSameDay ? (
                            <>
                              {date.startDateString} <br className="sm:hidden" />
                              {date.timeString}
                            </>
                          ) : (
                            <>
                              {date.startDateString} - <br className="sm:hidden" />
                              {date.endDateString}
                            </>
                          );
                        })()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Location */}
              {ticket.activity?.location && (
                <div className="sm:flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 md:text-lg">活動地點</h3>
                    <p className="text-gray-700 md:text-lg mb-2">{ticket.activity.location}</p>
                    {ticket.activity.notes && (
                      <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-3">
                        <p className="text-secondary-800 text-sm leading-relaxed whitespace-pre-line">
                          {ticket.activity.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Activity Link */}
              {ticket.activity?.livestreamUrl && (
                <div className="sm:flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                    <LinkIcon className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 md:text-lg">活動連結</h3>
                    <Link
                      href={ticket.activity.livestreamUrl}
                      className="text-neutral-800 hover:text-neutral-600 underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ticket.activity.livestreamUrl}
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
                          {ticket.startTime && format(new Date(ticket.startTime), "HH:mm")}
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                          {ticket.startTime && format(new Date(ticket.startTime), "yyyy-MM-dd")}
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
                          {ticket.endTime && format(new Date(ticket.endTime), "HH:mm")}
                        </div>
                        <div className="text-xs md:text-sm font-bold text-neutral-400">
                          {ticket.endTime && format(new Date(ticket.endTime), "yyyy-MM-dd")}
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
            {ticket.qrCodeToken && (
              <div className="p-6 bg-gray-50">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <QrCode className="h-5 w-5" />
                    <span className="font-semibold md:text-lg">入場憑證</span>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
                      <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center">
                        <QRCodeSVG
                          value={ticket.qrCodeToken}
                          size={160}
                          level="H"
                          className="w-full h-full p-2"
                        />
                      </div>
                    </div>
                  </div>
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
            )}

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
                      {ticket.order?.paidAt && (
                        <div className="flex justify-between">
                          <span className="text-neutral-800 md:text-lg">訂票時間</span>
                          <span className="font-semibold text-neutral-800 md:text-lg">
                            {format(new Date(ticket.order.paidAt), "yyyy-MM-dd HH:mm")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Participant Info */}
              {/* <Collapsible
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
                          {ticket.assignedName || userProfile?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 md:h-6 md:w-6 text-neutral-500" />
                        <div>
                          <div className="text-xs text-neutral-800">聯絡電話</div>
                          <div className="font-medium text-neutral-800 text-lg">
                            {ticket.assignedPhoneNumber || userProfile?.phoneNumber}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">電子郵件</span>
                        <span className="font-semibold text-neutral-800 md:text-lg">
                          {ticket.assignedEmail || userProfile?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible> */}

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
                          {ticket.organization?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">聯絡電話</span>
                        <Link
                          href={`tel:${ticket.organization?.phoneNumber}`}
                          className="font-semibold text-neutral-800 md:text-lg"
                        >
                          {ticket.organization?.phoneNumber || "無"}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">電子郵件</span>
                        <Link
                          href={`mailto:${ticket.organization?.email}`}
                          className="font-semibold text-neutral-800 md:text-lg"
                        >
                          {ticket.organization?.email}
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-800 md:text-lg">網站</span>
                        <Link
                          href={ticket.organization?.officialSiteUrl ?? ""}
                          className="font-semibold text-neutral-800 md:text-lg"
                        >
                          {ticket.organization?.officialSiteUrl || "無"}
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
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full flex-shrink-0" />
                          <span>請於活動當日攜帶此票券入場</span>
                        </li>
                        {ticket.activity?.location && (
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full flex-shrink-0" />
                            <span>線下活動如遇天候不佳將另行通知</span>
                          </li>
                        )}
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full flex-shrink-0" />
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
