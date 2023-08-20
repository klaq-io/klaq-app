import { useAsyncCallback } from "@react-hooks-library/core";
import { Coordinates } from "../Events/slices";
import webClient from "../../utils/webclient";
import { DistanceAndDuration } from "../../interface/distance-and-duration.interface";

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
