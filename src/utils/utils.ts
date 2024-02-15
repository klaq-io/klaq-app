import { add, format } from "date-fns";
import { Customer } from "../redux/Customer/slices";
import { Event, EventStatus } from "../redux/Events/slices";
import { EventProduct } from "../redux/Events/slices";
import { ProductItem } from "../redux/Products/slices";
import { MainEvent } from "interface/Event/main-event.interface";
import { SubEvent } from "interface/Event/subevent.interface";
import { getSubtotalForQuote } from "./quote";
import { Quote, QuoteStatus } from "interface/Quote/quote.interface";

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

export const sanitize = (obj: any) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      return value === null || value === "" ? undefined : value;
    })
  );
};

export const getTimeStr = (seconds: number): string => {
  if (seconds < 0) {
    throw new Error("Time cannot be negative.");
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let timeStr = "";
  if (hours > 0) {
    timeStr += `${hours}h `;
  }
  if (minutes > 0) {
    timeStr += `${minutes}${hours ? "" : " "}mn`;
  }

  return timeStr.trim();
};

export const getSubEventsListFromMainEvents = (mainEvent: MainEvent) => {
  return mainEvent.subEvents.map((subEvent) => {
    return {
      status: mainEvent.status,
      customer: mainEvent.customer,
      mainEventId: mainEvent.id,
      ...subEvent,
    };
  });
};

export const getSubEventsFromPeriod = (
  events: (SubEvent & {
    customer: Customer;
    status: EventStatus;
    mainEventId: string;
  })[],
  startDate: Date | string,
  endDate: Date | string
): (SubEvent & {
  customer: Customer;
  status: EventStatus;
  mainEventId: string;
})[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= start && eventDate <= end;
  });
};

const getEventValue = (quotes_: Quote[] | undefined) => {
  if (!quotes_ || !quotes_.length) return "0.00";

  const acceptedQuotes = quotes_.filter(
    (quote) => quote.status === QuoteStatus.ACCEPTED
  );
  if (acceptedQuotes.length)
    return acceptedQuotes
      .map((quote) => getSubtotalForQuote(quote))
      .reduce((acc, curr) => acc + curr)
      .toFixed(2);

  const quotes = quotes_
    .filter((quote) => quote.status !== QuoteStatus.REJECTED)
    .map((quote) => getSubtotalForQuote(quote));
  return Math.min(...quotes).toFixed(2);
};

export const getPipeValue = (mainEvents?: MainEvent[]) => {
  if (!mainEvents || !mainEvents.length) return "0.00";

  const events = mainEvents
    .map((mainEvent) => getEventValue(mainEvent.quotes))
    .map((value) => Number(value));

  return Math.min(...events).toFixed(2);
};

export const getPipeValueForCustomer = (customer?: Customer) => {
  if (!customer) return "0.00";

  if (!customer.mainEvents || !customer.mainEvents.length) return "0.00";

  const events = customer.mainEvents
    .map((mainEvent) => getEventValue(mainEvent.quotes))
    .map((value) => Number(value));
  const total = events.reduce((acc, curr) => acc + curr);
  return total.toFixed(2);
};
