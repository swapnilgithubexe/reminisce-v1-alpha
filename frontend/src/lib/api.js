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

//* Friends and Users Query functions
export const getUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
}

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
}

export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
}

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
}

//! Notifications page apis
export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
}

export const acceptFriendRequest = async (requestId) => {
  const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return res.data;
}

//! chat section
export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
}