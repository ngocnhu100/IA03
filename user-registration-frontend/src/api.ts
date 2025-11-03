import axios from "axios";

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const baseURL =
  (import.meta.env?.VITE_API_URL as string) || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type RegisterDto = { email: string; password: string };

export async function registerUser(data: RegisterDto) {
  const response = await api.post("/user/register", data);
  return response.data;
}

export default api;
