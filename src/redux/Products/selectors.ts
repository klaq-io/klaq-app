import { RootState } from "../store";
import { ProductItem } from "./slices";

export const getAllProducts = (state: RootState): ProductItem[] =>
  state.productItems.productItems;
