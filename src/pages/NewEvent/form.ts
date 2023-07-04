import * as Yup from "yup";

export const initialValues = {
  date: "",
  startTime: "",
  endTime: "",
  eventType: "",
  numberOfGuests: "",
  publicEvent: "yes",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

export const validationSchema = Yup.object({});
