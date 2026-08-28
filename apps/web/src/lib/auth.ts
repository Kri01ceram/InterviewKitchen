import api from "./api";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const register = async (data: RegisterInput) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginInput) => {
  const response = await api.post("/auth/login", data);

  const accessToken = response.data.data.accessToken;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } finally {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
    }
  }
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};