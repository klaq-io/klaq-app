import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../states";
export interface ProductItem {
  id: number;
  title: string;
  description?: string;
  price: number;
  mandatory: boolean;
  vtaRate: number;
}

export type ProductItemSliceType = [];

export const productItemSlice = createSlice({
  name: "productItem",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductItemSliceType>) => {
      state.productItems = action.payload;
    },
  },
});

export const { setProducts } = productItemSlice.actions;

export default productItemSlice.reducer;
