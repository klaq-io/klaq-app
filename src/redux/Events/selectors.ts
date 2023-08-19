import { RootState } from "../store";
import { Event, EventStatus } from "./slices";

export const getAllEvents = (state: RootState): Event[] => state.events.events;

export const getEventById = (state: RootState, id: string): Event | undefined =>
  state.events.events.find((event: any) => event.id === id);

export const getEventsByStatus = (
  state: RootState,
  ...status: EventStatus[]
): Event[] => {
  const events = state.events.events.filter((event: Event) =>
    status.includes(event.status)
  );
  return events || [];
};
