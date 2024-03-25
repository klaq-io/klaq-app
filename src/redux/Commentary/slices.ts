import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../states';
import { User } from '../../interface/user.interface';
import { CommentaryType } from 'enum/commentary-type.enum';

export interface Commentary {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  type: CommentaryType;
}
export const commentarySlice = createSlice({
  name: 'commentary',
  initialState,
  reducers: {
    setCommentaries: (state, action) => {
      state.commentaries = action.payload;
    },
    setCommentary: (state, action) => {
      state.commentaries = [...state.commentaries, action.payload];
    },
  },
});

export const { setCommentary, setCommentaries } = commentarySlice.actions;

export default commentarySlice.reducer;
