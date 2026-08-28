import api from "./api";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export const getProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateProfile = async (name: string) => {
  const response = await api.patch("/users/me", { name });
  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await api.patch("/users/me/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};