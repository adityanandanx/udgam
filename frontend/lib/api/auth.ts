import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

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

// Custom error handler
const handleApiError = (error: unknown) => {
  if (isAxiosError(error)) {
    if (!error.response) {
      throw new Error("Network error. Please check your connection.");
    }

    const { status, data } = error.response;
    toast(data.error || "An error occurred", { description: data.message });
    return;

    if (status === 401) {
      throw new Error("Authentication failed. Please check your credentials.");
    } else if (status === 403) {
      throw new Error("You do not have permission to perform this action.");
    } else if (status === 404) {
      throw new Error("Resource not found.");
    } else if (status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else {
      throw new Error(data?.message || "An unknown error occurred.");
    }
  }
  throw error; // Re-throw non-axios errors
};

export const login = async (data: LoginPayload) => {
  try {
    const res = await axios.post("/auth/login", data);
    return res.data; // { token, user }
  } catch (error) {
    handleApiError(error);
  }
};

export const register = async (data: RegisterPayload) => {
  try {
    const res = await axios.post("/auth/register", data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getProfile = async (
  token: string
): Promise<UserProfile | undefined> => {
  try {
    const res = await axios.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = () => {
  try {
    localStorage.removeItem("token");
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if localStorage fails, try to redirect
    window.location.href = "/login";
  }
};
