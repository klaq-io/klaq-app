import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../states';
export interface ProductItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  mandatory: boolean;
  vtaRate: string;
}

export type ProductItemSliceType = [];
export type ItemSliceType = ProductItem;

export const productItemSlice = createSlice({
  name: 'productItem',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductItemSliceType>) => {
      state.productItems = action.payload;
    },
    updateProducts: (state, action: PayloadAction<ItemSliceType>) => {
      state.productItems = state.productItems.map((item: ProductItem) =>
        item.id === action.payload.id ? action.payload : item,
      );
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.productItems = state.productItems.filter(
        (item: ProductItem) => item.id !== action.payload,
      );
    },
  },
});

export const { setProducts, updateProducts, deleteProduct } =
  productItemSlice.actions;

export default productItemSlice.reducer;
