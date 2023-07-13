import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";

export const useFetchSuggestions = () => {
  return useAsyncCallback(async (query: string) => {
    try {
      const response = await webClient.get(`/company/suggestions?q=${query}`);
      return response.data;
    } catch (error: any) {
      console.error(error);
    }
  });
};
