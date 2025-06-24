import type { CreateClientConfig } from "@hey-api/client-next";
import { getAuthToken } from "../auth";

export const createClientConfig: CreateClientConfig = (config) => {
  return {
    ...config,
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://eventa-backend-testing.onrender.com",
    auth: async () => {
      return await getAuthToken();
    },
  };
};
