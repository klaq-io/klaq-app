import { RootState } from "../store";
import { Event } from "./slices";

export const getAllEvents = (state: RootState): Event[] => state.events.events;

export const getEventById = (state: RootState, id: string): Event | undefined =>
  state.events.events.find((event: any) => event.id === id);
