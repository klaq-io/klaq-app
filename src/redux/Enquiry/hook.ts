import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "utils/webclient";

export const useCreateEnquiry = () => {
  return useAsyncCallback(async (data: any, token?: string | null) => {
    if (!token) return;
    try {
      await webClient.post(`/enquiry/${token}`, data);
    } catch (error) {
      console.error(error);
    }
  });
};
