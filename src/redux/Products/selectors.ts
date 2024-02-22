import { RootState } from '../store';
import { ProductItem } from './slices';

export const getAllProducts = (state: RootState): ProductItem[] =>
  state.productItems.productItems;

export const getProductById = (
  state: RootState,
  id: string,
): ProductItem | undefined => {
  return state.productItems.productItems.find(
    (productItem: ProductItem) => productItem.id === id,
  );
};
