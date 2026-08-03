export interface AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
  };

  accessToken: string;

  refreshToken: string;
}