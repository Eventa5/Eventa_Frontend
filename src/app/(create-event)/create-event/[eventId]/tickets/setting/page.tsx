"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormSection } from "@/components/ui/form-field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type TicketSettingFormData, ticketSettingSchema } from "@/features/organizer/schemas";
import { HOUR_OPTIONS, MINUTE_OPTIONS } from "@/features/shared/constants/date";
import {
  deleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeId,
  getApiV1ActivitiesByActivityIdTicketTypes,
  patchApiV1ActivitiesByActivityIdBasic,
  patchApiV1ActivitiesByActivityIdPublish,
  postApiV1ActivitiesByActivityIdTicketTypes,
  putApiV1ActivitiesByActivityIdTicketTypesByTicketTypeId,
} from "@/services/api/client/sdk.gen";
import type { TicketTypeResponse } from "@/services/api/client/types.gen";
import { useCreateEventStore } from "@/store/create-event";
import { useDialogStore } from "@/store/dialog";
import { combineDateTime, parseDateTime } from "@/utils/date";
import { useErrorHandler } from "@/utils/error-handler";
import { cn } from "@/utils/transformer";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  MoreVertical,
  Plus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFormTrigger,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

// 票券操作選單組件
const TicketActionsMenu = memo(
  ({
    ticketIndex,
    onDuplicate,
    onDelete,
    onToggleExpand,
    isExpanded,
  }: {
    ticketIndex: number;
    onDuplicate: (index: number) => void;
    onDelete: (index: number) => void;
    onToggleExpand: () => void;
    isExpanded: boolean;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-32 p-1"
        side="left"
      >
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-2 h-8"
            onClick={() => onDuplicate(ticketIndex)}
          >
            <Copy className="h-4 w-4" />
            複製
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-2 h-8"
            onClick={() => onDelete(ticketIndex)}
          >
            <Trash2 className="h-4 w-4" />
            刪除
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-2 h-8"
            onClick={onToggleExpand}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? "收合" : "展開更多"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
);

// 票券詳細設定組件
const TicketDetailSettings = memo(
  ({
    ticketIndex,
    control,
    errors,
    onToggleExpand,
    trigger,
  }: {
    ticketIndex: number;
    control: Control<TicketSettingFormData>;
    errors: FieldErrors<TicketSettingFormData>;
    onToggleExpand: () => void;
    trigger: UseFormTrigger<TicketSettingFormData>;
  }) => {
    const ticketErrors = errors?.tickets?.[ticketIndex];

    return (
      <div className="bg-gray-50">
        <div className="px-4 py-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium">售票時間</h3>

            {ticketErrors?.saleEndDate && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{ticketErrors.saleEndDate.message}</p>
              </div>
            )}

            {/* 售票開始時間 */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="text-red-500 mr-1">*</span>
                開始時間
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={control}
                  name={`tickets.${ticketIndex}.saleStartDate`}
                  type="date"
                  placeholder="選擇售票開始日期"
                  footerText="選擇售票開始日期"
                  className="col-span-1 bg-white border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                  trigger={trigger}
                  triggerFields={[`tickets.${ticketIndex}.saleEndDate`]}
                />
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name={`tickets.${ticketIndex}.saleStartHour`}
                      type="select"
                      options={HOUR_OPTIONS}
                      placeholder="時"
                      className="bg-white border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={[`tickets.${ticketIndex}.saleEndDate`]}
                    />
                    <FormField
                      control={control}
                      name={`tickets.${ticketIndex}.saleStartMinute`}
                      type="select"
                      options={MINUTE_OPTIONS}
                      placeholder="分"
                      className="bg-white border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={[`tickets.${ticketIndex}.saleEndDate`]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 售票結束時間 */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="text-red-500 mr-1">*</span>
                結束時間
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={control}
                  name={`tickets.${ticketIndex}.saleEndDate`}
                  type="date"
                  placeholder="選擇售票結束日期"
                  footerText="選擇售票結束日期"
                  className="col-span-1 bg-white border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                />
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name={`tickets.${ticketIndex}.saleEndHour`}
                      type="select"
                      options={HOUR_OPTIONS}
                      placeholder="時"
                      className="bg-white border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={[`tickets.${ticketIndex}.saleEndDate`]}
                    />
                    <FormField
                      control={control}
                      name={`tickets.${ticketIndex}.saleEndMinute`}
                      type="select"
                      options={MINUTE_OPTIONS}
                      placeholder="分"
                      className="bg-white border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={[`tickets.${ticketIndex}.saleEndDate`]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onToggleExpand}
              className="gap-2"
            >
              <ChevronUp className="h-4 w-4" />
              收合詳細資訊
            </Button>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 精確的比較函數，只在真正需要時重新渲染
    return (
      prevProps.ticketIndex === nextProps.ticketIndex &&
      prevProps.control === nextProps.control &&
      JSON.stringify(prevProps.errors?.tickets?.[prevProps.ticketIndex]) ===
        JSON.stringify(nextProps.errors?.tickets?.[nextProps.ticketIndex])
    );
  }
);

// 優化的票券項目組件
const TicketItem = memo(
  ({
    field,
    index,
    control,
    errors,
    onDuplicate,
    onDelete,
    trigger,
  }: {
    field: FieldArrayWithId<TicketSettingFormData, "tickets", "id">;
    index: number;
    control: Control<TicketSettingFormData>;
    errors: FieldErrors<TicketSettingFormData>;
    onDuplicate: (index: number) => void;
    onDelete: (index: number) => void;
    trigger: UseFormTrigger<TicketSettingFormData>;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 使用 useWatch 監聽當前票券的 isFree 值
    const isFree = useWatch({
      control,
      name: `tickets.${index}.isFree`,
      defaultValue: false,
    });

    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    return (
      <div className="border-b last:border-b-0">
        <div className="px-4 py-3 grid grid-cols-12 gap-4 items-start">
          <div className="col-span-4">
            <FormField
              control={control}
              name={`tickets.${index}.name`}
              placeholder="輸入票券名稱"
              className="w-full  border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
            />
          </div>
          <div className="col-span-3 text-center">
            <FormField
              control={control}
              name={`tickets.${index}.quantity`}
              type="input"
              inputType="number"
              className="w-full text-center  border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
            />
          </div>
          <div
            className={cn(
              "col-span-3 flex items-center justify-center h-full",
              isFree ? "items-start" : "items-center"
            )}
          >
            {isFree ? (
              <span className="text-sm font-medium h-8 flex items-center">免費</span>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-500">NT$</span>
                <FormField
                  control={control}
                  name={`tickets.${index}.price`}
                  type="input"
                  inputType="number"
                  className="w-20 text-center  border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                />
              </div>
            )}
          </div>
          <div className="col-span-2 text-center">
            <TicketActionsMenu
              ticketIndex={index}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onToggleExpand={toggleExpand}
              isExpanded={isExpanded}
            />
          </div>
        </div>

        {isExpanded && (
          <TicketDetailSettings
            ticketIndex={index}
            control={control}
            errors={errors}
            onToggleExpand={toggleExpand}
            trigger={trigger}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    const prevId = prevProps.field.id;
    const nextId = nextProps.field.id;

    return (
      prevId === nextId &&
      prevProps.index === nextProps.index &&
      prevProps.errors === nextProps.errors
    );
  }
);

// 手機版票券項目組件
const MobileTicketItem = memo(
  ({
    field,
    index,
    control,
    errors,
    onDuplicate,
    onDelete,
    trigger,
  }: {
    field: FieldArrayWithId<TicketSettingFormData, "tickets", "id">;
    index: number;
    control: Control<TicketSettingFormData>;
    errors: FieldErrors<TicketSettingFormData>;
    onDuplicate: (index: number) => void;
    onDelete: (index: number) => void;
    trigger: UseFormTrigger<TicketSettingFormData>;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 使用 useWatch 監聽當前票券的 isFree 值
    const isFree = useWatch({
      control,
      name: `tickets.${index}.isFree`,
      defaultValue: false,
    });

    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFD56B]" />
              <span className="text-sm font-medium text-gray-700">票券 #{index + 1}</span>
            </div>
            <TicketActionsMenu
              ticketIndex={index}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onToggleExpand={toggleExpand}
              isExpanded={isExpanded}
            />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <FormSection
            title="票券名稱"
            required
          >
            <FormField
              control={control}
              name={`tickets.${index}.name`}
              placeholder="輸入票券名稱"
              className="w-full bg-gray-50 border-gray-200 hover:border-[#FFD56B] focus:border-[#FFD56B] focus:bg-white transition-colors"
            />
          </FormSection>

          <div className="grid grid-cols-2 gap-4">
            <FormSection
              title="數量"
              required
            >
              <FormField
                control={control}
                name={`tickets.${index}.quantity`}
                type="input"
                inputType="number"
                placeholder="0"
                className="w-full text-center bg-gray-50 border-gray-200 hover:border-[#FFD56B] focus:border-[#FFD56B] focus:bg-white transition-colors"
              />
            </FormSection>

            <FormSection
              title="票價"
              required
            >
              {isFree ? (
                <div className="h-10 bg-green-50 border border-green-200 rounded-md flex items-center justify-center">
                  <span className="text-sm font-medium text-green-700">免費</span>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    NT$
                  </span>
                  <FormField
                    control={control}
                    name={`tickets.${index}.price`}
                    type="input"
                    inputType="number"
                    placeholder="0"
                    className="w-full pl-12 text-center bg-gray-50 border-gray-200 hover:border-[#FFD56B] focus:border-[#FFD56B] focus:bg-white transition-colors"
                  />
                </div>
              )}
            </FormSection>
          </div>

          {!isExpanded && (
            <div className="pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={toggleExpand}
                className="w-full gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                <ChevronDown className="h-4 w-4" />
                展開詳細設定
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <TicketDetailSettings
            ticketIndex={index}
            control={control}
            errors={errors}
            onToggleExpand={toggleExpand}
            trigger={trigger}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    const prevId = prevProps.field.id;
    const nextId = nextProps.field.id;

    return (
      prevId === nextId &&
      prevProps.index === nextProps.index &&
      prevProps.errors === nextProps.errors
    );
  }
);

export default function TicketSettingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  // 步驟保護：確保用戶按順序完成步驟
  const {
    currentEventId,
    activityData,
    organizationInfo,
    setCurrentEventId,
    completeEventCreation,
    loadEventData,
    checkStepAccess,
    isLoading,
  } = useCreateEventStore();

  // 錯誤處理
  const { handleError } = useErrorHandler();
  const { showError } = useDialogStore();

  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<TicketTypeResponse[]>([]);

  // 解析活動時間
  const startTimeData = useMemo(() => {
    return parseDateTime(activityData?.startTime);
  }, [activityData]);

  const endTimeData = useMemo(() => {
    return parseDateTime(activityData?.endTime);
  }, [activityData]);

  // 獲取明天的日期
  const tomorrow = useMemo(() => {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return nextDay;
  }, []);
  const tomorrowData = useMemo(() => parseDateTime(tomorrow.toISOString()), [tomorrow]);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<TicketSettingFormData>({
    resolver: zodResolver(ticketSettingSchema),
    defaultValues: {
      eventStartDate: tomorrowData?.date || "",
      eventStartHour: "",
      eventStartMinute: "",
      eventEndDate: tomorrowData?.date || "",
      eventEndHour: "",
      eventEndMinute: "",
      tickets: [],
    },
    mode: "all",
  }); // 設置當前活動ID並載入活動資料
  useEffect(() => {
    const numericEventId = Number.parseInt(eventId);
    if (!Number.isNaN(numericEventId)) {
      setCurrentEventId(numericEventId);

      // 如果當前活動ID不同，需要重新載入資料
      if (currentEventId !== numericEventId) {
        loadEventData();
      }
    }
  }, [eventId, currentEventId]);

  // 當活動資料載入完成時，設置表單預設值
  useEffect(() => {
    if (activityData && startTimeData && endTimeData) {
      const result = checkStepAccess("intro");
      if (!result.canAccess) {
        router.push(result.redirectTo);
      }

      setValue("eventStartDate", startTimeData?.date || tomorrowData?.date || "", {
        shouldTouch: true,
      });
      setValue("eventStartHour", startTimeData?.hour || "");
      setValue("eventStartMinute", startTimeData?.minute || "");
      setValue("eventEndDate", endTimeData?.date || tomorrowData?.date || "", {
        shouldTouch: true,
      });
      setValue("eventEndHour", endTimeData?.hour || "");
      setValue("eventEndMinute", endTimeData?.minute || "");
    }
  }, [activityData, startTimeData, endTimeData, tomorrowData]);

  // 載入票券資料
  const loadTickets = useCallback(async () => {
    try {
      const numericEventId = Number.parseInt(eventId);
      if (Number.isNaN(numericEventId)) {
        throw new Error("無效的活動 ID，請確認活動信息是否正確");
      }

      const response = await getApiV1ActivitiesByActivityIdTicketTypes({
        path: { activityId: numericEventId },
      });

      if (!response.error?.status === false) {
        throw new Error(response.error.message || "載入票券資料失敗，請稍後再試");
      }

      const ticketsData = Array.isArray(response.data) ? response.data : [];
      setTickets(ticketsData);
    } catch (error) {
      handleError(error);
      setTickets([]);
    }
  }, [eventId, handleError]);

  // 在頁面載入時載入票券資料
  useEffect(() => {
    if (eventId) {
      loadTickets();
    }
  }, [eventId, loadTickets]);

  // 監聽票券陣列變化，為每個票券設置監聽
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  // 當活動資料和票券資料載入完成時，重置表單預設值
  useEffect(() => {
    const formTickets = Array.isArray(tickets)
      ? tickets.map((ticket) => {
          const startTime = parseDateTime(ticket.startTime);
          const endTime = parseDateTime(ticket.endTime);

          return {
            id: ticket.id?.toString() || "",
            name: ticket.name || "",
            quantity: ticket.totalQuantity || 0,
            price: ticket.price || 0,
            isFree: (ticket.price || 0) === 0,
            saleStartDate: startTime?.date || tomorrowData?.date || "",
            saleStartHour: startTime?.hour || "09",
            saleStartMinute: startTime?.minute || "00",
            saleEndDate: endTime?.date || tomorrowData?.date || "",
            saleEndHour: endTime?.hour || "23",
            saleEndMinute: endTime?.minute || "59",
          };
        })
      : [];

    setValue("tickets", formTickets);
  }, [tickets, tomorrowData, setValue]);

  const duplicateTicket = useCallback(
    (index: number) => {
      try {
        const ticket = getValues().tickets[index];
        append(
          {
            ...ticket,
            id: `duplicate-${Date.now()}`,
            name: `${ticket.name} (複製)`,
          },
          {
            shouldFocus: false,
          }
        );
      } catch (error) {
        handleError(error);
      }
    },
    [append, getValues, handleError]
  );

  const deleteTicket = useCallback(
    async (index: number) => {
      try {
        const ticket = getValues().tickets[index];
        const ticketId = ticket.id;

        // 如果是新增或複製的票券，直接從表單中移除
        if (ticketId.startsWith("new-") || ticketId.startsWith("duplicate-")) {
          remove(index);
          return;
        }

        // 如果是真實的票券ID，調用API刪除
        const numericEventId = Number.parseInt(eventId);
        const numericTicketId = Number.parseInt(ticketId);

        if (!Number.isNaN(numericEventId) && !Number.isNaN(numericTicketId)) {
          const response = await deleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeId({
            path: {
              activityId: numericEventId,
              ticketTypeId: numericTicketId,
            },
          });

          if (response.error?.status === false) {
            throw new Error(response.error.message || "刪除票券失敗，請稍後再試");
          }

          // 重新載入票券資料
          await loadTickets();
        }

        remove(index);
      } catch (error) {
        handleError(error);
      }
    },
    [remove, getValues, eventId, loadTickets, handleError]
  );

  const addFreeTicket = useCallback(() => {
    if (isAddingTicket) return;

    setIsAddingTicket(true);

    append(
      {
        id: `new-${Date.now()}`,
        name: "免費票",
        quantity: 10,
        price: 0,
        isFree: true,
        saleStartDate: tomorrowData?.date || "",
        saleStartHour: "0",
        saleStartMinute: "0",
        saleEndDate: tomorrowData?.date || "",
        saleEndHour: "23",
        saleEndMinute: "59",
      },
      {
        shouldFocus: false,
      }
    );

    setIsAddingTicket(false);
  }, [append, isAddingTicket, tomorrowData]);

  const addPaidTicket = useCallback(() => {
    if (isAddingTicket) return;

    setIsAddingTicket(true);

    append(
      {
        id: `new-${Date.now()}`,
        name: "付費票",
        quantity: 10,
        price: 100,
        isFree: false,
        saleStartDate: tomorrowData?.date || "",
        saleStartHour: "0",
        saleStartMinute: "0",
        saleEndDate: tomorrowData?.date || "",
        saleEndHour: "23",
        saleEndMinute: "59",
      },
      {
        shouldFocus: false,
      }
    );

    setIsAddingTicket(false);
  }, [append, isAddingTicket, tomorrowData]);

  const handleComplete = useCallback(
    async (data: TicketSettingFormData) => {
      const numericEventId = Number.parseInt(eventId);
      if (Number.isNaN(numericEventId) || !activityData || !organizationInfo) {
        showError("缺少必要資料，請確認活動信息是否完整");
        return;
      }

      setIsSubmitting(true);

      try {
        // 1. 更新活動時間
        const startTime = combineDateTime(
          data.eventStartDate,
          data.eventStartHour,
          data.eventStartMinute
        );
        const endTime = combineDateTime(data.eventEndDate, data.eventEndHour, data.eventEndMinute);

        const basicResponse = await patchApiV1ActivitiesByActivityIdBasic({
          path: { activityId: numericEventId },
          body: {
            cover: activityData.cover,
            title: activityData.title || "",
            location: activityData.location || "",
            startTime,
            endTime,
            tags: activityData.tags || [],
          },
        });

        if (basicResponse.error?.status === false) {
          throw new Error(basicResponse.error.message || "更新基本資料失敗，請稍後再試");
        }

        // 2. 處理新增和複製的票券
        const newTickets = data.tickets.filter(
          (ticket) => ticket.id.startsWith("new-") || ticket.id.startsWith("duplicate-")
        );

        if (newTickets.length > 0) {
          const ticketData = newTickets.map((ticket) => ({
            name: ticket.name,
            price: ticket.price,
            totalQuantity: ticket.quantity,
            remainingQuantity: ticket.quantity,
            startTime: combineDateTime(
              ticket.saleStartDate,
              ticket.saleStartHour,
              ticket.saleStartMinute
            ),
            endTime: combineDateTime(ticket.saleEndDate, ticket.saleEndHour, ticket.saleEndMinute),
            isActive: true,
          }));

          await postApiV1ActivitiesByActivityIdTicketTypes({
            path: { activityId: numericEventId },
            body: ticketData,
          });
        }

        // 3. 處理更新現有票券
        const existingTickets = data.tickets.filter(
          (ticket) => !ticket.id.startsWith("new-") && !ticket.id.startsWith("duplicate-")
        );

        for (const ticket of existingTickets) {
          const ticketId = Number.parseInt(ticket.id);
          if (!Number.isNaN(ticketId)) {
            const ticketResponse = await putApiV1ActivitiesByActivityIdTicketTypesByTicketTypeId({
              path: {
                activityId: numericEventId,
                ticketTypeId: ticketId,
              },
              body: {
                name: ticket.name,
                price: ticket.price,
                totalQuantity: ticket.quantity,
                remainingQuantity: ticket.quantity,
                startTime: combineDateTime(
                  ticket.saleStartDate,
                  ticket.saleStartHour,
                  ticket.saleStartMinute
                ),
                endTime: combineDateTime(
                  ticket.saleEndDate,
                  ticket.saleEndHour,
                  ticket.saleEndMinute
                ),
                isActive: true,
              },
            });

            if (ticketResponse.error?.status === false) {
              throw new Error(ticketResponse.error.message || "更新票券失敗，請稍後再試");
            }
          }
        } // 4. 發布活動
        const publishResponse = await patchApiV1ActivitiesByActivityIdPublish({
          path: { activityId: numericEventId },
        });

        if (publishResponse.error?.status === false) {
          throw new Error(publishResponse.error.message || "發布活動失敗，請稍後再試");
        }

        // 6. 清除 store 資料並跳轉
        completeEventCreation();

        router.push(`/organizer/events/${eventId}`);
      } catch (error) {
        handleError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [eventId, activityData, organizationInfo, completeEventCreation, router, handleError, showError]
  );

  const handleBack = useCallback(() => {
    router.push(`/create-event/${eventId}/intro`);
  }, [eventId, router]);

  const desktopTicketList = useMemo(
    () =>
      fields.map((field, index) => {
        return (
          <TicketItem
            key={field.id}
            field={field}
            index={index}
            control={control}
            errors={errors}
            onDuplicate={duplicateTicket}
            onDelete={deleteTicket}
            trigger={trigger}
          />
        );
      }),
    [fields, control, errors, duplicateTicket, deleteTicket, trigger]
  );

  const mobileTicketList = useMemo(
    () =>
      fields.map((field, index) => {
        return (
          <MobileTicketItem
            key={field.id}
            field={field}
            index={index}
            control={control}
            errors={errors}
            onDuplicate={duplicateTicket}
            onDelete={deleteTicket}
            trigger={trigger}
          />
        );
      }),
    [fields, control, errors, duplicateTicket, deleteTicket, trigger]
  );

  const AddTicketButtons = useMemo(
    () => (
      <div className="flex gap-4 justify-center mt-4">
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-gray-300 hover:border-[#FFD56B] hover:bg-[#FFD56B]/10 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addFreeTicket}
          disabled={isAddingTicket || isSubmitting}
        >
          <Plus className={`h-4 w-4 ${isAddingTicket ? "animate-spin" : ""}`} />
          {isAddingTicket ? "新增中..." : "免費票"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-gray-300 hover:border-[#FFD56B] hover:bg-[#FFD56B]/10 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addPaidTicket}
          disabled={isAddingTicket || isSubmitting}
        >
          <Plus className={`h-4 w-4 ${isAddingTicket ? "animate-spin" : ""}`} />
          {isAddingTicket ? "新增中..." : "付費票"}
        </Button>
      </div>
    ),
    [addFreeTicket, addPaidTicket, isAddingTicket, isSubmitting]
  );

  // 如果正在載入活動資料，顯示載入中
  if (isLoading && !activityData) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-lg text-gray-600">載入活動資料中...</div>
      </div>
    );
  }

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-6">設定活動票券！</h1>

      <form
        onSubmit={handleSubmit(handleComplete)}
        className="space-y-6"
      >
        {/* 活動時間設定 */}
        <FormSection
          title="修改活動時間"
          required
        >
          <div className="space-y-4">
            {/* 活動開始時間 */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="text-red-500 mr-1">*</span>
                開始時間
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={control}
                  name="eventStartDate"
                  type="date"
                  placeholder="選擇開始日期"
                  footerText="選擇活動開始日期"
                  className="col-span-1  border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                  trigger={trigger}
                  triggerFields={["eventEndDate"]}
                />
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="eventStartHour"
                      type="select"
                      options={HOUR_OPTIONS}
                      placeholder="時"
                      className=" border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={["eventEndDate"]}
                    />
                    <FormField
                      control={control}
                      name="eventStartMinute"
                      type="select"
                      options={MINUTE_OPTIONS}
                      placeholder="分"
                      className=" border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={["eventEndDate"]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 活動結束時間 */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="text-red-500 mr-1">*</span>
                結束時間
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={control}
                  name="eventEndDate"
                  type="date"
                  placeholder="選擇結束日期"
                  footerText="選擇活動結束日期"
                  className="col-span-1  border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                />
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="eventEndHour"
                      type="select"
                      options={HOUR_OPTIONS}
                      placeholder="時"
                      className=" border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={["eventEndDate"]}
                    />
                    <FormField
                      control={control}
                      name="eventEndMinute"
                      type="select"
                      options={MINUTE_OPTIONS}
                      placeholder="分"
                      className=" border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]"
                      trigger={trigger}
                      triggerFields={["eventEndDate"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* 票券設定 */}
        <FormSection
          title="新增的活動票券"
          required
        >
          <div className="hidden md:block bg-white rounded-lg overflow-hidden border">
            <div className="bg-gray-600 text-white px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium">
              <div className="col-span-4">票券名稱</div>
              <div className="col-span-3 text-center">票券數量</div>
              <div className="col-span-3 text-center">票價</div>
              <div className="col-span-2 text-center">操作</div>
            </div>
            {fields.length > 0 ? (
              desktopTicketList
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <p className="text-sm">尚未新增任何票券</p>
                <p className="text-xs mt-1">請點擊下方按鈕新增票券</p>
              </div>
            )}
          </div>

          <div className="md:hidden space-y-4">
            {fields.length > 0 ? (
              mobileTicketList
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <SlidersHorizontal className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-sm mb-1">尚未新增任何票券</p>
                <p className="text-gray-400 text-xs">請點擊下方按鈕新增票券</p>
              </div>
            )}
          </div>

          {errors?.tickets && <p className="text-sm text-red-500">{errors.tickets.message}</p>}

          {AddTicketButtons}
        </FormSection>

        <div className="flex justify-between border-t border-gray-200 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
            className="text-[#262626] border-gray-300 rounded-lg w-[140px] md:w-[160px] py-2 md:py-4 text-base font-normal transition-colors cursor-pointer h-auto hover:"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回上一步
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`${
              isValid && !isSubmitting
                ? "bg-[#FFD56B] hover:bg-[#FFCA28] cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            } text-[#262626] rounded-lg w-[140px] md:w-[160px] py-2 md:py-4 text-base font-normal transition-colors h-auto`}
          >
            {isSubmitting ? "發布中..." : "發布活動"}
          </Button>
        </div>
      </form>
    </div>
  );
}
