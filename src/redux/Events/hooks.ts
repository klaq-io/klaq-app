import { useAsyncCallback } from "@react-hooks-library/core";
import { useDispatch } from "react-redux";
import webClient from "../../utils/webclient";
// import { setEvents } from "./slices";

// export const useFetchEvents = () => {
//   const dispatch = useDispatch();
//   return useAsyncCallback(async () => {
//     try {
//       const res = await webClient.get("/events");
//       dispatch(setEvents(res.data));
//     } catch (error: any) {
//       return error.response;
//     }
//   });
// };

// export const useAddEvent = () => {
//   return useAsyncCallback(async () => {
//     try {
//       const res = await webClient.post("/events");
//     } catch (error: any) {
//       return error.response;
//     }
//   });
// };
