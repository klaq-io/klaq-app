import { RootState } from "../store";
import { Event } from "./slices";

export const getAllEvents = (state: RootState): Event[] => state.events.events;
