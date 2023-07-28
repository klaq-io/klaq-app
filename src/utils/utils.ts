import { Customer } from "../redux/Customer/slices";
import { EventProduct } from "../redux/Events/slices";
import { ProductItem } from "../redux/Products/slices";

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export const shortenString = (maxLen: number, str?: string): string => {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen).trim() + "...";
};

export const formatSiret = (siret?: string): string => {
  if (!siret) return "";
  if (siret.length !== 14) return siret;
  return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, "$1 $2 $3 $4");
};

export const getCustomerValue = (
  products: ProductItem[],
  customer?: Customer
) => {
  if (!customer) return 0;
  if (customer.events === undefined) return 0;

  const customerProducts = customer.events?.flatMap((event) =>
    event.products?.map((product: EventProduct) => ({
      product: products.find(
        (productItems) => productItems.id === product.productId
      ),
      quantity: product.quantity,
    }))
  );
  const customerValue = customerProducts.reduce((acc, curr) => {
    if (curr?.product?.price && typeof curr.quantity === "number") {
      return acc + curr.product.price * curr.quantity;
    } else {
      return acc;
    }
  }, 0);
  return customerValue.toFixed(2);
};
