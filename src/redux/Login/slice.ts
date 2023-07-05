import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../states";

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  stageName: string;
  birthDate: Date;
  isMailVerified: boolean;
  isPhoneNumberConfirmed: boolean;
}

export type UserSliceType = User;

export const userSlice: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSliceType>) => {
      state.user = action.payload;
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
