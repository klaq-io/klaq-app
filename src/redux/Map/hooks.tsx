import { useAsyncCallback } from "@react-hooks-library/core";
import { AddressSuggestions } from "../../interface/address-suggestion.interface";
import { DistanceAndDuration } from "../../interface/distance-and-duration.interface";
import { RetrieveAddress } from "../../interface/retrieve-address.interface";
import webClient from "../../utils/webclient";

export const useGetAutocompleteSuggestions = () => {
  return useAsyncCallback(
    async (query: string): Promise<AddressSuggestions> => {
      try {
        const { data } = await webClient.get(`map/suggestions?query=${query}`);
        return data;
      } catch (error: any) {
        console.error(error);
        return error.response;
      }
    }
  );
};

export const useRetrieveAddress = () => {
  return useAsyncCallback(
    async (mapboxId: string): Promise<RetrieveAddress> => {
      try {
        const { data } = await webClient.get(`map/retrieve?id=${mapboxId}`);
        return data;
      } catch (error: any) {
        console.error(error);
        return error.response;
      }
    }
  );
};

export const useGetDistanceAndDuration = () => {
  return useAsyncCallback(
    async (from: string, to: string): Promise<DistanceAndDuration> => {
      try {
        const { data } = await webClient.get(
          `map/distance-and-duration?from=${from}&to=${to}`
        );
        return data;
      } catch (error: any) {
        console.error(error);
        return error.response;
      }
    }
  );
};
