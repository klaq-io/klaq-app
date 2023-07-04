import * as Yup from "yup";

export const initialValues = {
  date: "",
  startTime: "",
  endTime: "",
  eventType: "",
  numberOfGuests: "",
  publicEvent: "Yes",
  location: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  },
};

export const validationSchema = Yup.object({});
