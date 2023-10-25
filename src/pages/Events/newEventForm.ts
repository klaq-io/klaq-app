import { CustomerType } from "redux/Customer/slices";

export const initialValues = {
  customer: {
    name: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    type: CustomerType.PRIVATE,
  },
  title: "",
  kEvents: [
    {
      date: "",
      startTime: "",
      endTime: "",
      address: "",
      city: "",
      zipcode: "",
      country: "",
      title: "",
      guests: 0,
      publicEvent: "true",
    },
  ],
};
