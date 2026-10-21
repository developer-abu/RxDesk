

import apiClient from "../api/apiClient";

export const createChamber = async (chamberData) => {
  const { data } = await apiClient.post("/chambers", chamberData);
  return data;
};

export const getChambers = async () => {
  const { data } = await apiClient.get("/chambers");
  return data;
};

export const getChamber = async (chamberId) => {
  const { data } = await apiClient.get(`/chambers/${chamberId}`);
  return data;
};
