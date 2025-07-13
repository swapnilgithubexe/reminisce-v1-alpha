import { axiosInstance } from "./axios";

export const signup = async (signUpData) => {
  const res = await axiosInstance.post("/auth/signup", signUpData);
  return res.data;
}
export const login = async (loginData) => {
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
}
export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
}

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log(`debug/dev mode:- ${error.message}`);
    return null;
  }
}

export const completeOnboarding = async (userData) => {
  const res = axiosInstance.post("/auth/onboarding", userData);
  return res.data;
}