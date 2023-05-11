import * as Yup from "yup";

export const initialValues = {
  date: "",
  time: "",
  duration: "",
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
  budget: "",
};

export const validationSchema = Yup.object({});
