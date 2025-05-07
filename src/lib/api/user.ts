import apiClient from "./client";

export interface ProfileData {
  memberId: string;
  name: string;
  displayName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  birthday: string;
  gender: "male" | "female" | "nonBinary";
  region: string;
  address?: string;
  identity: "general" | "student" | "retiree";
  avatar?: string | null;
}

export interface ProfileFormValues {
  name: string;
  email: string;
  avatar?: string | null;
  displayName: string | null;
  birthday: Date;
  phoneNumber: string | null;
  countryCode: string | null;
  region: string | null;
  address?: string;
  gender: "male" | "female" | "nonBinary";
  identity: "general" | "student" | "retiree";
}

export interface ApiResponse<T> {
  message: string;
  status: boolean;
  data: T;
}

export type ProfileResponse = ApiResponse<ProfileData>;

export async function getProfile(): Promise<ProfileData> {
  const response = await apiClient.get<ApiResponse<ProfileData>>("/api/v1/users/profile");
  return response.data;
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  const response = await apiClient.put<ApiResponse<ProfileData>>("/api/v1/users/profile", data);
  return response.data;
}
