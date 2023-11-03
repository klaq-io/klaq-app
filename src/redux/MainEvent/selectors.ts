import { MainEvent } from "interface/Event/main-event.interface";
import { EventStatus } from "redux/Events/slices";
import { RootState } from "redux/store";

export const getMainEvent = (state: RootState, id: string): MainEvent =>
  state.mainEvents.mainEvents.find(
    (mainEvent: MainEvent) => mainEvent.id === id
  );

export const getMainEvents = (state: RootState): MainEvent[] =>
  state.mainEvents.mainEvents;

export const getMainEventsByStatus = (
  state: RootState,
  ...status: EventStatus[]
): MainEvent[] =>
  state.mainEvents.mainEvents.filter((event: MainEvent) =>
    status.includes(event.status)
  );
