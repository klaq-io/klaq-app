import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../states";
import { Settings } from "interface/user.interface";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  stageName: string;
  password: string;
  birthDate: Date | string;
  isMailVerified: boolean;
  isPhoneNumberConfirmed: boolean;
  isGoogleOAuthActivated: boolean;
  publicPhone: string;
  publicEmail: string;
  category: string;
  events?: Event[];
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  logoUrl?: string;
  settings: Settings;
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
