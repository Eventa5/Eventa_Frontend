import { getApiV1Orders } from "@/services/api/client/sdk.gen";
import type { OrderResponse } from "@/services/api/client/types.gen";
import useSWR from "swr";

export type OrderStatus = "已付款" | "待付款" | "已取消" | "已逾期" | "已使用";

export interface Order {
  id: string;
  status: OrderStatus;
  paidAt: string | null;
  paidExpiredAt: string;
  paymentMethod: string | null;
  activity: {
    title: string;
    location: string;
    startTime: string;
    endTime: string;
  };
}

export type OrderTabsValue = "all" | "paid" | "pending" | "canceled" | "expired";

interface OrdersResponse {
  data: OrderResponse[];
}

export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  title?: string;
  from?: string;
  to?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
    ["orders", params],
    async () => {
      const queryParams = {
        ...params,
        from: params?.from || undefined,
        to: params?.to || undefined,
      };

      const response = await getApiV1Orders({
        query: queryParams,
      });
      return { data: response.data?.data || [] };
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
