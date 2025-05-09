import { getToken } from "@/lib/auth";

interface ApiResponse<T> {
  message: string;
  status: boolean;
  data: T;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
// 定義攔截器類型
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: Error) => Promise<never>;

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  // 添加請求攔截器
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加響應攔截器
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // 添加錯誤攔截器
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // 執行請求攔截器
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let finalConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    return finalConfig;
  }

  // 執行響應攔截器
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    return finalResponse;
  }

  // 執行錯誤攔截器
  private async applyErrorInterceptors(error: Error): Promise<never> {
    for (const interceptor of this.errorInterceptors) {
      try {
        await interceptor(error);
      } catch (e) {
        console.error("Error in error interceptor:", e);
      }
    }
    throw error;
  }

  // 封裝的 fetch 方法
  async fetch<T>(url: string, config: RequestInit = {}): Promise<T> {
    try {
      // 添加基礎配置
      const baseConfig: RequestInit = {
        ...config,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
      };

      // 應用請求攔截器
      const finalConfig = await this.applyRequestInterceptors(baseConfig);

      // 發送請求
      const response = await fetch(`${API_BASE_URL}${url}`, finalConfig);

      // 應用響應攔截器
      const finalResponse = await this.applyResponseInterceptors(response);

      // 處理響應
      if (!finalResponse.status) {
        console.log(finalResponse);
        throw new Error(`HTTP error! status: ${finalResponse.status}`);
      }

      const result = await finalResponse.json();

      if (!result.status) {
        throw new Error(result.message || "API 請求失敗");
      }

      return result as T;
    } catch (error) {
      // 應用錯誤攔截器
      return this.applyErrorInterceptors(error as Error);
    }
  }

  // 封裝的 GET 方法
  get<T>(url: string, config: RequestInit = {}): Promise<T> {
    return this.fetch<T>(url, { ...config, method: "GET" });
  }

  // 封裝的 POST 方法
  post<T>(url: string, data: Record<string, unknown>, config: RequestInit = {}): Promise<T> {
    return this.fetch<T>(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 封裝的 PUT 方法
  put<T>(url: string, data: Record<string, unknown>, config: RequestInit = {}): Promise<T> {
    return this.fetch<T>(url, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // 封裝的 DELETE 方法
  delete<T>(url: string, config: RequestInit = {}): Promise<T> {
    return this.fetch<T>(url, { ...config, method: "DELETE" });
  }
}

// 創建單例實例
const apiClient = new ApiClient();

// 添加認證攔截器
apiClient.addRequestInterceptor((config) => {
  const token = getToken();
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return config;
});

// 添加錯誤處理攔截器
apiClient.addErrorInterceptor(async (error) => {
  console.error("API Error:", error);
  // 可以在這裡處理特定的錯誤，例如 401 未授權
  // if (error.message.includes('401')) {
  //   // 處理未授權的情況
  //   localStorage.removeItem('token');
  //   window.location.href = '/';
  // }
  throw error;
});

export default apiClient;
