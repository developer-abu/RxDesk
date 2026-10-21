

import apiClient from "../api/apiClient";

export const register = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const verifyEmail = async (payload) => {
  const { data } = await apiClient.post("/auth/verify-email", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

export const forgotPassword = async (payload) => {
  const { data } = await apiClient.post("/auth/forgot-password", payload);
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await apiClient.post("/auth/reset-password", payload);
  return data;
};
