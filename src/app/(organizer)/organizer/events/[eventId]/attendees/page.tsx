"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getApiV1ActivitiesByActivityIdParticipants,
  patchApiV1TicketsByTicketIdUsed,
} from "@/services/api/client/sdk.gen";
import type { GetParticipantResponse } from "@/services/api/client/types.gen";
import { cn } from "@/utils/transformer";
import { CheckCircle, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// 狀態顏色映射
const getStatusColor = (status: string) => {
  switch (status) {
    case "used":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "assigned":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "unassigned":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "canceled":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "overdue":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// 狀態文字映射
const getStatusText = (status: string) => {
  switch (status) {
    case "used":
      return "已使用";
    case "assigned":
      return "已分配";
    case "unassigned":
      return "未分配";
    case "canceled":
      return "已取消";
    case "overdue":
      return "已逾期";
    default:
      return status;
  }
};

export default function AttendeesPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [participants, setParticipants] = useState<GetParticipantResponse[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<GetParticipantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);

  // 載入參與者資料
  const loadParticipants = async (page = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const response = await getApiV1ActivitiesByActivityIdParticipants({
        path: { activityId: Number.parseInt(eventId) },
        query: { page, limit: pageLimit },
      });

      if (response.data?.data) {
        setParticipants(response.data.data);
        setFilteredParticipants(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("載入參與者資料失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  // 重新載入參與者資料
  const handleRefresh = () => {
    loadParticipants(currentPage);
  };
  // 處理報到功能
  const handleCheckIn = async (ticketId: number, participantName: string) => {
    try {
      // 調用報到 API
      const response = await patchApiV1TicketsByTicketIdUsed({
        path: { ticketId: ticketId.toString() },
      });

      if (response.error) {
        throw new Error(response.error.message || "報到失敗，請稍後再試");
      }

      // 成功後顯示提示訊息
      toast.success(`${participantName} 報到成功！`);

      // 重新載入參與者資料
      await loadParticipants(currentPage);
    } catch (error) {
      console.error("報到失敗:", error);
      const errorMessage = error instanceof Error ? error.message : "報到失敗，請稍後再試";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [eventId]);

  return (
    <div className="min-h-screen h-full ">
      <div className="container min-h-full h-full mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">參與者名單</h1>
        </div>

        {/* 操作區域 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 w-full md:w-auto">參與者管理</h2>
            <div className="flex w-full md:w-auto justify-end md:justify-center items-center gap-3">
              {/* 每頁筆數選擇 */}
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">每頁顯示:</p>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    const newLimit = Number(value);
                    setLimit(newLimit);
                    setCurrentPage(1);
                    loadParticipants(1, newLimit);
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 筆</SelectItem>
                    <SelectItem value="20">20 筆</SelectItem>
                    <SelectItem value="50">50 筆</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleRefresh}
                className="bg-primary-500 hover:saturate-150 text-neutral-800 duration-200 active:scale-95 cursor-pointer rounded-md flex-grow md:flex-grow-0"
              >
                重新搜尋
              </Button>
            </div>
          </div>
        </div>

        {/* 參與者表格 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 桌面版表格 */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    票券編號
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    票種
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    票價
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    建立時間
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">載入中</h3>
                        <p className="text-gray-500">正在獲取參與者資料...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredParticipants.map((participant) => (
                      <tr
                        key={participant.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {participant.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.ticketType?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          NT$ {participant.ticketType?.price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={getStatusColor(participant.status || "")}
                          >
                            {getStatusText(participant.status || "")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.createdAt
                            ? new Date(participant.createdAt).toLocaleDateString("zh-TW", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {participant.status === "unassigned" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleCheckIn(
                                  participant.id || 0,
                                  participant.assignedName || "參與者"
                                )
                              }
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              報到
                            </Button>
                          )}
                          {participant.status === "used" && (
                            <span className="text-emerald-600 font-medium">已使用</span>
                          )}
                          {participant.status === "assigned" && (
                            <span className="text-blue-600 font-medium">已分配</span>
                          )}
                          {participant.status === "canceled" && (
                            <span className="text-rose-600 font-medium">已取消</span>
                          )}
                          {participant.status === "overdue" && (
                            <span className="text-gray-600 font-medium">已逾期</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* 空狀態 */}
                    {filteredParticipants.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12"
                        >
                          <div className="text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              沒有找到參與者
                            </h3>
                            <p className="text-gray-500">目前還沒有人報名這個活動</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* 手機版卡片列表 */}
          <div className="xl:hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">參與者清單</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">載入中</h3>
                  <p className="text-gray-500">正在獲取參與者資料...</p>
                </div>
              ) : (
                <>
                  {filteredParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{participant.id}</h3>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            getStatusColor(participant.status || ""),
                            "text-sm px-2 py-1"
                          )}
                        >
                          {getStatusText(participant.status || "")}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">票種:</span>
                          <span className="text-gray-900">{participant.ticketType?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">票價:</span>
                          <span className="text-gray-900">
                            NT$
                            {participant.ticketType?.price?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">建立時間:</span>
                          <span className="text-gray-900">
                            {participant.createdAt
                              ? new Date(participant.createdAt).toLocaleDateString("zh-TW", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                        </div>
                      </div>
                      {participant.status === "unassigned" && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleCheckIn(
                                participant.id || 0,
                                participant.assignedName || "參與者"
                              )
                            }
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            報到
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* 空狀態 - 手機版 */}
                  {filteredParticipants.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到參與者</h3>
                      <p className="text-gray-500">目前還沒有人報名這個活動</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 分頁 */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((prev) => Math.max(1, prev - 1));
                loadParticipants(Math.max(1, currentPage - 1));
              }}
              disabled={currentPage === 1}
            >
              上一頁
            </Button>

            <span className="px-4 py-2 text-sm text-gray-600">
              第 {currentPage} 頁，共 {totalPages} 頁
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                loadParticipants(Math.min(totalPages, currentPage + 1));
              }}
              disabled={currentPage === totalPages}
            >
              下一頁
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
