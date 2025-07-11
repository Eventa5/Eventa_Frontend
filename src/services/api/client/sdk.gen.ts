// This file is auto-generated by @hey-api/openapi-ts

import {
  type Client,
  type Options as ClientOptions,
  type TDataShape,
  formDataBodySerializer,
} from "@hey-api/client-next";
import { client as _heyApiClient } from "./client.gen";
import type {
  DeleteApiV1ActivitiesByActivityIdFavoriteData,
  DeleteApiV1ActivitiesByActivityIdFavoriteError,
  DeleteApiV1ActivitiesByActivityIdFavoriteResponse,
  DeleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdData,
  DeleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdError,
  DeleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdResponse,
  DeleteApiV1OrganizationsData,
  DeleteApiV1OrganizationsError,
  DeleteApiV1OrganizationsResponse,
  GetApiV1ActivitiesByActivityIdCheckedInData,
  GetApiV1ActivitiesByActivityIdCheckedInError,
  GetApiV1ActivitiesByActivityIdCheckedInResponse,
  GetApiV1ActivitiesByActivityIdData,
  GetApiV1ActivitiesByActivityIdError,
  GetApiV1ActivitiesByActivityIdIncomeData,
  GetApiV1ActivitiesByActivityIdIncomeError,
  GetApiV1ActivitiesByActivityIdIncomeResponse,
  GetApiV1ActivitiesByActivityIdParticipantsData,
  GetApiV1ActivitiesByActivityIdParticipantsError,
  GetApiV1ActivitiesByActivityIdParticipantsResponse,
  GetApiV1ActivitiesByActivityIdResponse,
  GetApiV1ActivitiesByActivityIdTicketTypesData,
  GetApiV1ActivitiesByActivityIdTicketTypesError,
  GetApiV1ActivitiesByActivityIdTicketTypesResponse,
  GetApiV1ActivitiesData,
  GetApiV1ActivitiesError,
  GetApiV1ActivitiesPopularData,
  GetApiV1ActivitiesPopularError,
  GetApiV1ActivitiesPopularResponse,
  GetApiV1ActivitiesResponse,
  GetApiV1CategoriesData,
  GetApiV1CategoriesError,
  GetApiV1CategoriesResponse,
  GetApiV1CurrenciesData,
  GetApiV1CurrenciesError,
  GetApiV1CurrenciesResponse,
  GetApiV1OrdersByOrderIdCheckoutResultData,
  GetApiV1OrdersByOrderIdCheckoutResultError,
  GetApiV1OrdersByOrderIdCheckoutResultResponse,
  GetApiV1OrdersByOrderIdData,
  GetApiV1OrdersByOrderIdError,
  GetApiV1OrdersByOrderIdResponse,
  GetApiV1OrdersData,
  GetApiV1OrdersError,
  GetApiV1OrdersResponse,
  GetApiV1OrganizationsByOrganizationIdData,
  GetApiV1OrganizationsByOrganizationIdError,
  GetApiV1OrganizationsByOrganizationIdResponse,
  GetApiV1OrganizationsData,
  GetApiV1OrganizationsError,
  GetApiV1OrganizationsResponse,
  GetApiV1TicketsByTicketIdData,
  GetApiV1TicketsByTicketIdError,
  GetApiV1TicketsByTicketIdResponse,
  GetApiV1UsersGoogleCallbackData,
  GetApiV1UsersGoogleLoginData,
  GetApiV1UsersProfileData,
  GetApiV1UsersProfileError,
  GetApiV1UsersProfileResponse,
  PatchApiV1ActivitiesByActivityIdBasicData,
  PatchApiV1ActivitiesByActivityIdBasicError,
  PatchApiV1ActivitiesByActivityIdBasicResponse,
  PatchApiV1ActivitiesByActivityIdCancelData,
  PatchApiV1ActivitiesByActivityIdCancelError,
  PatchApiV1ActivitiesByActivityIdCancelResponse,
  PatchApiV1ActivitiesByActivityIdCategoriesData,
  PatchApiV1ActivitiesByActivityIdCategoriesError,
  PatchApiV1ActivitiesByActivityIdCategoriesResponse,
  PatchApiV1ActivitiesByActivityIdContentData,
  PatchApiV1ActivitiesByActivityIdContentError,
  PatchApiV1ActivitiesByActivityIdContentResponse,
  PatchApiV1ActivitiesByActivityIdPublishData,
  PatchApiV1ActivitiesByActivityIdPublishError,
  PatchApiV1ActivitiesByActivityIdPublishResponse,
  PatchApiV1ActivitiesByActivityIdTypeData,
  PatchApiV1ActivitiesByActivityIdTypeError,
  PatchApiV1ActivitiesByActivityIdTypeResponse,
  PatchApiV1OrdersByOrderIdCancelData,
  PatchApiV1OrdersByOrderIdCancelError,
  PatchApiV1OrdersByOrderIdCancelResponse,
  PatchApiV1TicketsByTicketIdUsedData,
  PatchApiV1TicketsByTicketIdUsedError,
  PatchApiV1TicketsByTicketIdUsedResponse,
  PostApiV1ActivitiesByActivityIdContentImageData,
  PostApiV1ActivitiesByActivityIdContentImageError,
  PostApiV1ActivitiesByActivityIdContentImageResponse,
  PostApiV1ActivitiesByActivityIdCoverData,
  PostApiV1ActivitiesByActivityIdCoverError,
  PostApiV1ActivitiesByActivityIdCoverResponse,
  PostApiV1ActivitiesByActivityIdFavoriteData,
  PostApiV1ActivitiesByActivityIdFavoriteError,
  PostApiV1ActivitiesByActivityIdFavoriteResponse,
  PostApiV1ActivitiesByActivityIdTicketTypesData,
  PostApiV1ActivitiesByActivityIdTicketTypesError,
  PostApiV1ActivitiesByActivityIdTicketTypesResponse,
  PostApiV1ActivitiesData,
  PostApiV1ActivitiesError,
  PostApiV1ActivitiesResponse,
  PostApiV1CategoriesByCategoryIdImageData,
  PostApiV1CategoriesByCategoryIdImageError,
  PostApiV1CategoriesByCategoryIdImageResponse,
  PostApiV1ChatData,
  PostApiV1ChatError,
  PostApiV1ChatResponse,
  PostApiV1CurrenciesData,
  PostApiV1CurrenciesError,
  PostApiV1CurrenciesResponse,
  PostApiV1OrdersByOrderIdCheckoutData,
  PostApiV1OrdersByOrderIdCheckoutError,
  PostApiV1OrdersByOrderIdCheckoutResponse,
  PostApiV1OrdersByOrderIdRefundData,
  PostApiV1OrdersByOrderIdRefundError,
  PostApiV1OrdersByOrderIdRefundResponse,
  PostApiV1OrdersData,
  PostApiV1OrdersError,
  PostApiV1OrdersResponse,
  PostApiV1OrdersReturnData,
  PostApiV1OrganizationsByOrganizationIdImagesData,
  PostApiV1OrganizationsByOrganizationIdImagesError,
  PostApiV1OrganizationsByOrganizationIdImagesResponse,
  PostApiV1OrganizationsData,
  PostApiV1OrganizationsError,
  PostApiV1OrganizationsResponse,
  PostApiV1UsersLoginData,
  PostApiV1UsersLoginError,
  PostApiV1UsersLoginResponse,
  PostApiV1UsersProfileAvatarData,
  PostApiV1UsersProfileAvatarError,
  PostApiV1UsersProfileAvatarResponse,
  PostApiV1UsersSignupData,
  PostApiV1UsersSignupError,
  PostApiV1UsersSignupResponse,
  PutApiV1ActivitiesByActivityIdData,
  PutApiV1ActivitiesByActivityIdError,
  PutApiV1ActivitiesByActivityIdResponse,
  PutApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdData,
  PutApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdError,
  PutApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdResponse,
  PutApiV1OrganizationsData,
  PutApiV1OrganizationsError,
  PutApiV1OrganizationsResponse,
  PutApiV1UsersForgetData,
  PutApiV1UsersForgetError,
  PutApiV1UsersForgetResponse,
  PutApiV1UsersProfileData,
  PutApiV1UsersProfileError,
  PutApiV1UsersProfileResponse,
  PutApiV1UsersResetPasswordData,
  PutApiV1UsersResetPasswordError,
  PutApiV1UsersResetPasswordResponse,
} from "./types.gen";

export type Options<
  TData extends TDataShape = TDataShape,
  ThrowOnError extends boolean = boolean,
> = ClientOptions<TData, ThrowOnError> & {
  /**
   * You can provide a client instance returned by `createClient()` instead of
   * individual options. This might be also useful if you want to implement a
   * custom client.
   */
  client?: Client;
  /**
   * You can pass arbitrary values through the `meta` object. This can be
   * used to access values that aren't defined as part of the SDK function.
   */
  meta?: Record<string, unknown>;
};

/**
 * 獲取熱門活動資料
 * 獲取熱門活動資料
 */
export const getApiV1ActivitiesPopular = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1ActivitiesPopularData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetApiV1ActivitiesPopularResponse,
    GetApiV1ActivitiesPopularError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/popular",
    ...options,
  });
};

/**
 * 獲取活動資料
 * 獲取活動資料
 */
export const getApiV1Activities = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1ActivitiesData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetApiV1ActivitiesResponse,
    GetApiV1ActivitiesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities",
    ...options,
  });
};

/**
 * 新增一筆活動資料
 * 在選擇活動形式為線上或線下後，即新增一筆活動資料到db中
 */
export const postApiV1Activities = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1ActivitiesData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1ActivitiesResponse,
    PostApiV1ActivitiesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 取得某一活動的所有票種資訊
 * 當使用者要報名一個活動時，會先取得這一個活動的所有票種資訊，例如：一般票、早鳥票等等
 */
export const getApiV1ActivitiesByActivityIdTicketTypes = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1ActivitiesByActivityIdTicketTypesData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1ActivitiesByActivityIdTicketTypesResponse,
    GetApiV1ActivitiesByActivityIdTicketTypesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/ticketTypes",
    ...options,
  });
};

/**
 * 新增特定活動票種
 * 主辦方在創建活動時所用之新增票種功能
 */
export const postApiV1ActivitiesByActivityIdTicketTypes = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1ActivitiesByActivityIdTicketTypesData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1ActivitiesByActivityIdTicketTypesResponse,
    PostApiV1ActivitiesByActivityIdTicketTypesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/ticketTypes",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 刪除特定活動之單一票種
 * 主辦方刪除票種功能
 */
export const deleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeId = <
  ThrowOnError extends boolean = false,
>(
  options: Options<DeleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).delete<
    DeleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdResponse,
    DeleteApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/ticketTypes/{ticketTypeId}",
    ...options,
  });
};

/**
 * 編輯特定活動之單一票種
 * 主辦方編輯票種功能
 */
export const putApiV1ActivitiesByActivityIdTicketTypesByTicketTypeId = <
  ThrowOnError extends boolean = false,
>(
  options: Options<PutApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).put<
    PutApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdResponse,
    PutApiV1ActivitiesByActivityIdTicketTypesByTicketTypeIdError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/ticketTypes/{ticketTypeId}",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 獲取特定活動的參加者名單
 * 獲取特定活動的參加者名單
 */
export const getApiV1ActivitiesByActivityIdParticipants = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1ActivitiesByActivityIdParticipantsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1ActivitiesByActivityIdParticipantsResponse,
    GetApiV1ActivitiesByActivityIdParticipantsError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/participants",
    ...options,
  });
};

/**
 * 獲取特定活動的收入
 * 獲取特定活動的收入，包含總收入、總報名人數、總剩餘可售票券、票種收入小計、票種報名人數小計、近五次區間收入
 */
export const getApiV1ActivitiesByActivityIdIncome = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1ActivitiesByActivityIdIncomeData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1ActivitiesByActivityIdIncomeResponse,
    GetApiV1ActivitiesByActivityIdIncomeError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/income",
    ...options,
  });
};

/**
 * 獲取特定活動的報到狀況
 * 獲取特定活動的詳細報到狀況，包含報到人數、活動狀態，checkedInCount= 報到人數、soldCount= 售出票券數量、totalTicketQuantity= 總票券數
 */
export const getApiV1ActivitiesByActivityIdCheckedIn = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1ActivitiesByActivityIdCheckedInData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1ActivitiesByActivityIdCheckedInResponse,
    GetApiV1ActivitiesByActivityIdCheckedInError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/checkedIn",
    ...options,
  });
};

/**
 * 獲取特定的活動資料
 * 獲取特定活動資料
 */
export const getApiV1ActivitiesByActivityId = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1ActivitiesByActivityIdData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1ActivitiesByActivityIdResponse,
    GetApiV1ActivitiesByActivityIdError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}",
    ...options,
  });
};

/**
 * 更新活動資料
 * 更新活動資料
 */
export const putApiV1ActivitiesByActivityId = <ThrowOnError extends boolean = false>(
  options: Options<PutApiV1ActivitiesByActivityIdData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).put<
    PutApiV1ActivitiesByActivityIdResponse,
    PutApiV1ActivitiesByActivityIdError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 取消收藏活動
 * 使用者登入後，可以取消收藏活動
 */
export const deleteApiV1ActivitiesByActivityIdFavorite = <ThrowOnError extends boolean = false>(
  options: Options<DeleteApiV1ActivitiesByActivityIdFavoriteData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).delete<
    DeleteApiV1ActivitiesByActivityIdFavoriteResponse,
    DeleteApiV1ActivitiesByActivityIdFavoriteError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/favorite",
    ...options,
  });
};

/**
 * 收藏活動
 * 使用者登入後，可以收藏活動
 */
export const postApiV1ActivitiesByActivityIdFavorite = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1ActivitiesByActivityIdFavoriteData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1ActivitiesByActivityIdFavoriteResponse,
    PostApiV1ActivitiesByActivityIdFavoriteError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/favorite",
    ...options,
  });
};

/**
 * 編輯活動主圖
 * 編輯活動主圖，照片大小限制4MB內
 */
export const postApiV1ActivitiesByActivityIdCover = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1ActivitiesByActivityIdCoverData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1ActivitiesByActivityIdCoverResponse,
    PostApiV1ActivitiesByActivityIdCoverError,
    ThrowOnError
  >({
    ...formDataBodySerializer,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/cover",
    ...options,
    headers: {
      "Content-Type": null,
      ...options?.headers,
    },
  });
};

/**
 * 編輯活動形式
 * 設定活動形式，線上或線下
 */
export const patchApiV1ActivitiesByActivityIdType = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1ActivitiesByActivityIdTypeData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1ActivitiesByActivityIdTypeResponse,
    PatchApiV1ActivitiesByActivityIdTypeError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/type",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 新增活動時，設定活動主題步驟
 * 設定活動主題，至少要選擇一個主題，最多兩個，帶入主題ID array
 */
export const patchApiV1ActivitiesByActivityIdCategories = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1ActivitiesByActivityIdCategoriesData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1ActivitiesByActivityIdCategoriesResponse,
    PatchApiV1ActivitiesByActivityIdCategoriesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/categories",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 新增活動時，設定基本資料步驟
 * 新增活動時的基本資料步驟，包含活動名稱、活動起迄時間、活動地點
 */
export const patchApiV1ActivitiesByActivityIdBasic = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1ActivitiesByActivityIdBasicData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1ActivitiesByActivityIdBasicResponse,
    PatchApiV1ActivitiesByActivityIdBasicError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/basic",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 新增活動時，設定詳細內容步驟
 * 新增活動時的詳細內容步驟，包含活動簡介、活動詳細內容
 */
export const patchApiV1ActivitiesByActivityIdContent = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1ActivitiesByActivityIdContentData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1ActivitiesByActivityIdContentResponse,
    PatchApiV1ActivitiesByActivityIdContentError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/content",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 上傳活動內容圖片
 * 上傳活動內容圖片，照片大小限制4MB內，回傳圖片 url
 */
export const postApiV1ActivitiesByActivityIdContentImage = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1ActivitiesByActivityIdContentImageData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1ActivitiesByActivityIdContentImageResponse,
    PostApiV1ActivitiesByActivityIdContentImageError,
    ThrowOnError
  >({
    ...formDataBodySerializer,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/content/image",
    ...options,
    headers: {
      "Content-Type": null,
      ...options?.headers,
    },
  });
};

/**
 * 新增活動時最後一步驟，發布活動
 * 前置步驟都設定完成後的最後一步，發布活動，所有使用者皆可看到此活動
 */
export const patchApiV1ActivitiesByActivityIdPublish = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1ActivitiesByActivityIdPublishData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1ActivitiesByActivityIdPublishResponse,
    PatchApiV1ActivitiesByActivityIdPublishError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/publish",
    ...options,
  });
};

/**
 * 取消活動
 * 將活動狀態改為canceled
 */
export const patchApiV1ActivitiesByActivityIdCancel = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1ActivitiesByActivityIdCancelData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1ActivitiesByActivityIdCancelResponse,
    PatchApiV1ActivitiesByActivityIdCancelError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/activities/{activityId}/cancel",
    ...options,
  });
};

/**
 * 獲取活動類別資料
 * 獲取活動類別資料
 */
export const getApiV1Categories = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1CategoriesData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetApiV1CategoriesResponse,
    GetApiV1CategoriesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/categories",
    ...options,
  });
};

/**
 * 編輯主題圖片
 * 照片大小限制4MB內
 */
export const postApiV1CategoriesByCategoryIdImage = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1CategoriesByCategoryIdImageData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1CategoriesByCategoryIdImageResponse,
    PostApiV1CategoriesByCategoryIdImageError,
    ThrowOnError
  >({
    ...formDataBodySerializer,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/categories/{categoryId}/image",
    ...options,
    headers: {
      "Content-Type": null,
      ...options?.headers,
    },
  });
};

/**
 * 發送聊天訊息
 * 用戶可以發送問題，AI 會根據數據庫信息回答
 */
export const postApiV1Chat = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1ChatData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1ChatResponse,
    PostApiV1ChatError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/chat",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 取得所有幣別清單
 */
export const getApiV1Currencies = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1CurrenciesData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetApiV1CurrenciesResponse,
    GetApiV1CurrenciesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/currencies",
    ...options,
  });
};

/**
 * 新增幣別
 */
export const postApiV1Currencies = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1CurrenciesData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1CurrenciesResponse,
    PostApiV1CurrenciesError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/currencies",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 查看所有訂單
 * 查看單一使用者的訂單
 */
export const getApiV1Orders = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1OrdersData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetApiV1OrdersResponse,
    GetApiV1OrdersError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders",
    ...options,
  });
};

/**
 * 創建訂單
 * 創建新的訂單
 */
export const postApiV1Orders = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1OrdersData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1OrdersResponse,
    PostApiV1OrdersError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 後端來接受 ECPay 回傳的訂單資訊
 */
export const postApiV1OrdersReturn = <ThrowOnError extends boolean = false>(
  options?: Options<PostApiV1OrdersReturnData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders/return",
    ...options,
  });
};

/**
 * 查看單一訂單
 * 查看單一訂單的詳細資訊
 */
export const getApiV1OrdersByOrderId = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1OrdersByOrderIdData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1OrdersByOrderIdResponse,
    GetApiV1OrdersByOrderIdError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders/{orderId}",
    ...options,
  });
};

/**
 * 取消訂單
 * 用來手動取消訂單
 */
export const patchApiV1OrdersByOrderIdCancel = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1OrdersByOrderIdCancelData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1OrdersByOrderIdCancelResponse,
    PatchApiV1OrdersByOrderIdCancelError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders/{orderId}/cancel",
    ...options,
  });
};

/**
 * 結帳訂單
 * 用來結帳訂單
 */
export const postApiV1OrdersByOrderIdCheckout = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1OrdersByOrderIdCheckoutData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1OrdersByOrderIdCheckoutResponse,
    PostApiV1OrdersByOrderIdCheckoutError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders/{orderId}/checkout",
    ...options,
  });
};

/**
 * 獲取付款結果
 * 獲取訂單的付款結果
 */
export const getApiV1OrdersByOrderIdCheckoutResult = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1OrdersByOrderIdCheckoutResultData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1OrdersByOrderIdCheckoutResultResponse,
    GetApiV1OrdersByOrderIdCheckoutResultError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders/{orderId}/checkout/result",
    ...options,
  });
};

/**
 * 訂單退款
 * 用來退款訂單
 */
export const postApiV1OrdersByOrderIdRefund = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1OrdersByOrderIdRefundData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1OrdersByOrderIdRefundResponse,
    PostApiV1OrdersByOrderIdRefundError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/orders/{orderId}/refund",
    ...options,
  });
};

/**
 * 刪除主辦單位
 * 刪除主辦單位
 */
export const deleteApiV1Organizations = <ThrowOnError extends boolean = false>(
  options: Options<DeleteApiV1OrganizationsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).delete<
    DeleteApiV1OrganizationsResponse,
    DeleteApiV1OrganizationsError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/organizations",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 取得主辦單位列表
 * 取得當前使用者的主辦單位列表
 */
export const getApiV1Organizations = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1OrganizationsData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetApiV1OrganizationsResponse,
    GetApiV1OrganizationsError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/organizations",
    ...options,
  });
};

/**
 * 創建主辦單位
 * 創建新的主辦單位
 */
export const postApiV1Organizations = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1OrganizationsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1OrganizationsResponse,
    PostApiV1OrganizationsError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/organizations",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 更新主辦單位
 * 更新主辦單位資料
 */
export const putApiV1Organizations = <ThrowOnError extends boolean = false>(
  options: Options<PutApiV1OrganizationsData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).put<
    PutApiV1OrganizationsResponse,
    PutApiV1OrganizationsError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/organizations",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 取得主辦單位詳細資料
 * 取得主辦單位詳細資料
 */
export const getApiV1OrganizationsByOrganizationId = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1OrganizationsByOrganizationIdData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1OrganizationsByOrganizationIdResponse,
    GetApiV1OrganizationsByOrganizationIdError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/organizations/{organizationId}",
    ...options,
  });
};

/**
 * 編輯主辦圖片
 * 編輯主辦主圖及封面照片，照片大小限制4MB內
 */
export const postApiV1OrganizationsByOrganizationIdImages = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1OrganizationsByOrganizationIdImagesData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1OrganizationsByOrganizationIdImagesResponse,
    PostApiV1OrganizationsByOrganizationIdImagesError,
    ThrowOnError
  >({
    ...formDataBodySerializer,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/organizations/{organizationId}/images",
    ...options,
    headers: {
      "Content-Type": null,
      ...options?.headers,
    },
  });
};

/**
 * 查看單一票券
 * 查看單一票券的詳細資訊
 */
export const getApiV1TicketsByTicketId = <ThrowOnError extends boolean = false>(
  options: Options<GetApiV1TicketsByTicketIdData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).get<
    GetApiV1TicketsByTicketIdResponse,
    GetApiV1TicketsByTicketIdError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/tickets/{ticketId}",
    ...options,
  });
};

/**
 * 票券報到
 * 參加活動時點選報到，票券狀態改為used
 */
export const patchApiV1TicketsByTicketIdUsed = <ThrowOnError extends boolean = false>(
  options: Options<PatchApiV1TicketsByTicketIdUsedData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).patch<
    PatchApiV1TicketsByTicketIdUsedResponse,
    PatchApiV1TicketsByTicketIdUsedError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/tickets/{ticketId}/used",
    ...options,
  });
};

/**
 * 用戶註冊
 * 創建新用戶帳號
 */
export const postApiV1UsersSignup = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1UsersSignupData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1UsersSignupResponse,
    PostApiV1UsersSignupError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/signup",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 用戶登入
 * 用戶登入系統並獲取 JWT 認證 Token
 */
export const postApiV1UsersLogin = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1UsersLoginData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1UsersLoginResponse,
    PostApiV1UsersLoginError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/login",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * Google OAuth 登入
 * 開始 Google OAuth 認證流程，重定向至 Google 登入頁面
 */
export const getApiV1UsersGoogleLogin = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1UsersGoogleLoginData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/google/login",
    ...options,
  });
};

/**
 * Google OAuth 回調
 * Google 認證完成後的回調處理
 */
export const getApiV1UsersGoogleCallback = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1UsersGoogleCallbackData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/google/callback",
    ...options,
  });
};

/**
 * 請求密碼重設
 * 發送重設密碼郵件至指定信箱
 */
export const putApiV1UsersForget = <ThrowOnError extends boolean = false>(
  options: Options<PutApiV1UsersForgetData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).put<
    PutApiV1UsersForgetResponse,
    PutApiV1UsersForgetError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/forget",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 確認密碼重設
 * 使用重設令牌和新密碼完成密碼重設
 */
export const putApiV1UsersResetPassword = <ThrowOnError extends boolean = false>(
  options: Options<PutApiV1UsersResetPasswordData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).put<
    PutApiV1UsersResetPasswordResponse,
    PutApiV1UsersResetPasswordError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/resetPassword",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 獲取用戶資料
 * 獲取當前登入用戶的資料
 */
export const getApiV1UsersProfile = <ThrowOnError extends boolean = false>(
  options?: Options<GetApiV1UsersProfileData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).get<
    GetApiV1UsersProfileResponse,
    GetApiV1UsersProfileError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/profile",
    ...options,
  });
};

/**
 * 更新用戶資料
 * 更新當前登入用戶的資料
 */
export const putApiV1UsersProfile = <ThrowOnError extends boolean = false>(
  options?: Options<PutApiV1UsersProfileData, ThrowOnError>
) => {
  return (options?.client ?? _heyApiClient).put<
    PutApiV1UsersProfileResponse,
    PutApiV1UsersProfileError,
    ThrowOnError
  >({
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/profile",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

/**
 * 上傳用戶頭像
 * 上傳一張圖片作為當前登入用戶的大頭貼，圖片將會上傳至 Imgur 並儲存其 URL 至 DB
 */
export const postApiV1UsersProfileAvatar = <ThrowOnError extends boolean = false>(
  options: Options<PostApiV1UsersProfileAvatarData, ThrowOnError>
) => {
  return (options.client ?? _heyApiClient).post<
    PostApiV1UsersProfileAvatarResponse,
    PostApiV1UsersProfileAvatarError,
    ThrowOnError
  >({
    ...formDataBodySerializer,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/api/v1/users/profile/avatar",
    ...options,
    headers: {
      "Content-Type": null,
      ...options?.headers,
    },
  });
};
