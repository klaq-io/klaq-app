import { RootState } from "../store";
import { Commentary } from "./slices";

export const getCommentaries = (state: RootState): Commentary[] =>
  state.commentaries.commentaries as Commentary[];
