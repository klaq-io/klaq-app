import { useAsyncCallback } from "@react-hooks-library/core";
import { Coordinates } from "../Events/slices";
import webClient from "../../utils/webclient";
import { DistanceAndDuration } from "../../interface/distance-and-duration.interface";
import { AddressSuggestions } from "../../interface/address-suggestion.interface";
import { RetrieveAddress } from "../../interface/retrieve-address.interface";

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
    async (
      origin: Coordinates,
      destination: Coordinates
    ): Promise<DistanceAndDuration> => {
      try {
        const { data } = await webClient.get(
          `map/distance-and-duration?origin.latitude=${origin.latitude}&origin.longitude=${origin.longitude}&destination.latitude=${destination.latitude}&destination.longitude=${destination.longitude}`
        );
        return data;
      } catch (error: any) {
        console.error(error);
        return error.response;
      }
    }
  );
};
