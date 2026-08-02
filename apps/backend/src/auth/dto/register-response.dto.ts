export interface RegisterResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
  };
}