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
  startDate: Date,
  endDate: Date
) => {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
};

export const getDayStr = (date: Date) => {
  const dateTranslation = [
    "events.day.monday",
    "events.day.tuesday",
    "events.day.wednesday",
    "events.day.thursday",
    "events.day.friday",
    "events.day.saturday",
    "events.day.sunday",
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
