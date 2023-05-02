import { RootState } from "../store";
import { User } from "./slice";

export const getUser = (state: RootState) => state.user as User;
