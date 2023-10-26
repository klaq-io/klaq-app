import { MainEvent } from "interface/Event/main-event.interface";
import { RootState } from "redux/store";

export const getMainEvent = (state: RootState, id: string): MainEvent =>
  state.mainEvents.mainEvents.find(
    (mainEvent: MainEvent) => mainEvent.id === id
  );
