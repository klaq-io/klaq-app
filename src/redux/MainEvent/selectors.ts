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

export const getThisMonthMainEvents = (state: RootState): MainEvent[] => {
  const thisMonth = new Date().getMonth();
  // check each subEvents of mainEvents if it is in this month
  return state.mainEvents.mainEvents.filter((mainEvent: MainEvent) => {
    const subEvents = mainEvent.subEvents;
    return subEvents.some((subEvent) => {
      const subEventDate = new Date(subEvent.date);
      return subEventDate.getMonth() === thisMonth;
    });
  });
};
