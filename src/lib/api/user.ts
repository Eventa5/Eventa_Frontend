import apiClient from "./client";

export interface ProfileData {
  id: string;
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
  avatar: string | null;
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

export interface ApiResponse<T = void> {
  message: string;
  status: boolean;
  data?: T;
}

export type ProfileResponse = ApiResponse<ProfileData>;

export async function getProfile(): Promise<ProfileData> {
  const response = await apiClient.get<ApiResponse<ProfileData>>("/api/v1/users/profile");
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  const response = await apiClient.put<ApiResponse<ProfileData>>("/api/v1/users/profile", data);
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export interface LoginRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface SignUpRequest extends Record<string, unknown> {
  email: string;
  password: string;
  checkPassword: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(data: LoginRequest): Promise<ApiResponse<string>> {
  return apiClient.post<ApiResponse<string>>("/api/v1/users/login", data);
}

export async function signup(data: SignUpRequest): Promise<ApiResponse> {
  return apiClient.post<ApiResponse>("/api/v1/users/signup", data);
}
