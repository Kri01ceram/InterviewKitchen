import axios from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

type RetryableRequestConfig = {
  _retry?: boolean;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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

        setAccessToken(accessToken);
        requestConfig.headers.Authorization = `Bearer ${accessToken}`;

        return api(requestConfig);
      } catch {
        setAccessToken(null);
      }
    }

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register"
    ) {
      setAccessToken(null);
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