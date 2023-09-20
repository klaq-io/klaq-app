import { add, format } from "date-fns";
import { Customer } from "../redux/Customer/slices";
import { Event } from "../redux/Events/slices";
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

export const getPipeValue = (products: ProductItem[], events: Event[]) => {
  const pipeProducts = events.flatMap((event) =>
    event.products?.map((product: EventProduct) => ({
      product: products.find(
        (productItems) => productItems.id === product.productId
      ),
      quantity: product.quantity,
    }))
  );

  const pipeValue = pipeProducts.reduce((acc, curr) => {
    if (curr?.product?.price && typeof curr.quantity === "number") {
      return acc + curr.product.price * curr.quantity;
    } else {
      return acc;
    }
  }, 0);
  return pipeValue.toFixed(2);
};

export const getEventsForPeriod = (
  events: Event[],
  startDate: Date | string,
  endDate: Date | string
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= start && eventDate <= end;
  });
};

export const getDayStr = (date: Date) => {
  const dateTranslation = [
    "events.day.sunday",
    "events.day.monday",
    "events.day.tuesday",
    "events.day.wednesday",
    "events.day.thursday",
    "events.day.friday",
    "events.day.saturday",
  ];
  const day = new Date(date).getDay();
  return dateTranslation[day];
};

export const getMonthStr = (date: Date) => {
  const dateTranslation = [
    "events.month.january",
    "events.month.february",
    "events.month.march",
    "events.month.april",
    "events.month.may",
    "events.month.june",
    "events.month.july",
    "events.month.august",
    "events.month.september",
    "events.month.october",
    "events.month.november",
    "events.month.december",
  ];
  const month = new Date(date).getMonth();
  return dateTranslation[month];
};

export const getThisWeekDates = () => {
  const today = new Date();
  const startOfWeek = format(
    add(today, { days: -today.getDay() }),
    "yyyy-MM-dd"
  );
  const endOfWeek = format(
    add(today, { days: 6 - today.getDay() }),
    "yyyy-MM-dd"
  );
  return [startOfWeek, endOfWeek];
};

export const getThisMonthDates = () => {
  const today = new Date();
  const startOfMonth = format(today, "yyyy-MM-01");
  const endOfMonth = format(add(today, { months: 1 }), "yyyy-MM-01");
  return [startOfMonth, endOfMonth];
};

export const getThisYearDates = () => {
  const today = new Date();
  const startOfYear = format(today, "yyyy-01-01");
  const endOfYear = format(add(today, { years: 1 }), "yyyy-01-01");
  return [startOfYear, endOfYear];
};

export const getCorrespondingProduct = (
  eventProduct: EventProduct,
  products: ProductItem[]
) => {
  return products.find((product) => product.id === eventProduct.productId);
};

export const getEventSubtotal = (
  eventProducts: EventProduct[] | undefined,
  products: ProductItem[]
) => {
  if (!eventProducts) return 0;
  if (!products || !products.length) return 0;
  const totalEventProducts = eventProducts.map((product: EventProduct) => ({
    product: products.find(
      (productItems: ProductItem) => productItems.id === product.productId
    ),
    quantity: product.quantity,
  }));
  const total = totalEventProducts.reduce((acc, curr) => {
    if (curr?.product?.price && typeof curr.quantity === "number") {
      return acc + curr.product.price * curr.quantity;
    } else {
      return acc;
    }
  }, 0);
  return total.toFixed(2);
};

export const getEventTax = (
  eventProducts: EventProduct[] | undefined,
  products: ProductItem[]
) => {
  if (!eventProducts) return 0;
  if (!products || !products.length) return 0;

  const totalEventProducts = eventProducts.map((product: EventProduct) => ({
    product: products.find(
      (productItems: ProductItem) => productItems.id === product.productId
    ),
    quantity: product.quantity,
  }));

  const convertedTotalEventProducts = totalEventProducts.map((product) => ({
    product: product.product,
    quantity: product.quantity,
    vtaRate: Number(product.product?.vtaRate),
  }));

  const total = convertedTotalEventProducts.reduce((acc, curr) => {
    if (curr?.product?.price && typeof curr.quantity === "number") {
      return acc + (curr.vtaRate / 100) * curr.product.price * curr.quantity;
    } else {
      return acc;
    }
  }, 0);
  return total.toFixed(2);
};

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const getHumanFileSize = (bytes: number, si = false, dp = 1): string => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
};
