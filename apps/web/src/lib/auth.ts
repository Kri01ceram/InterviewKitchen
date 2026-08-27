import  api  from "./api";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
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
  const response = await api.post("/auth/logout");
  return response.data;
};