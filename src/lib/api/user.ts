import apiClient from "./client";

export interface ProfileResponse {
  id: string;
  memberId: string;
  name: string;
  email: string;
  avatar: string;
  displayName: string;
  birthday: string;
  gender: "male" | "female" | "nonBinary";
  phoneNumber: string;
  countryCode: string;
  region: string;
  address: string;
  identity: "general" | "student" | "retiree";
}

export interface ProfileFormValues {
  name: string;
  email: string;
  avatar?: string;
  displayName: string | null;
  birthday: Date;
  phoneNumber: string | null;
  countryCode: string | null;
  region: string | null;
  address?: string;
  gender: "male" | "female" | "nonBinary";
  identity: "general" | "student" | "retiree";
}

export async function getProfile(): Promise<ProfileResponse> {
  return apiClient.get<ProfileResponse>("/api/v1/users/profile");
}

export async function updateProfile(data: ProfileFormValues): Promise<ProfileResponse> {
  return apiClient.put<ProfileResponse>("/api/v1/users/profile", {
    ...data,
    birthday: data.birthday ? data.birthday.toISOString().split("T")[0].replace(/-/g, "/") : null,
  });
}
