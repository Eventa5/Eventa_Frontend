import { getApiV1Orders } from "@/services/api/client/sdk.gen";
import type { OrderResponse, PaginationResponse } from "@/services/api/client/types.gen";
import useSWR from "swr";

export type OrderStatus = "paid" | "pending" | "canceled" | "expired" | "processing" | "failed";

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

export type OrderTabsValue = "all" | "paid" | "pending" | "canceled" | "expired" | "refunded";

export interface OrdersResponse {
  data: OrderResponse[];
  pagination: PaginationResponse;
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
      return {
        data: response.data?.data || [],
        pagination: (response.data as any)?.pagination || {
          currentPage: 1,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    },
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateIfStale: true,
      dedupingInterval: 0,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
