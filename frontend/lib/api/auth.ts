import axios from "@/lib/axios";

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type UserProfile = {
  firstName?: string;
  lastName?: string;
  username: string;
};

export const login = async (data: LoginPayload) => {
  const res = await axios.post("/auth/login", data);
  return res.data; // { token, user }
};

export const register = async (data: RegisterPayload) => {
  const res = await axios.post("/auth/register", data);
  return res.data;
};

export const getProfile = async (token: string): Promise<UserProfile> => {
  const res = await axios.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
