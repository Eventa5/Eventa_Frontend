import type { CreateClientConfig } from "@hey-api/client-next";
import { getAuthToken } from "../auth";

export const createClientConfig: CreateClientConfig = (config) => {
  return {
    ...config,
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://eventa-backend-pgun.onrender.com",
    auth: async () => {
      return await getAuthToken();
    },
  };
};
