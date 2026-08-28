import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

type RetryableRequestConfig = {
  _retry?: boolean;
};

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessToken")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestConfig = error.config as
      | (typeof error.config & RetryableRequestConfig)
      | undefined;
    const requestUrl = requestConfig?.url || "";
    const isSessionRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      requestConfig &&
      !requestConfig._retry &&
      !isSessionRequest
    ) {
      requestConfig._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const accessToken = response.data.data.accessToken;

        window.localStorage.setItem("accessToken", accessToken);
        requestConfig.headers.Authorization = `Bearer ${accessToken}`;

        return api(requestConfig);
      } catch {
        window.localStorage.removeItem("accessToken");
      }
    }

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register"
    ) {
      window.localStorage.removeItem("accessToken");
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(
  error: unknown,
  fallback: string
) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
}

export default api;