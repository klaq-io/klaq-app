import { RootState } from "../store";
import { User } from "./slice";

export const getUser = (state: RootState): User =>
  (state.user as any).user as User;
