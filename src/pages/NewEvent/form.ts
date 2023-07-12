import * as Yup from "yup";

export const initialValues = {
  date: "",
  startTime: "",
  endTime: "",
  eventType: "wedding",
  numberOfGuests: 0,
  publicEvent: "yes",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "PRIVATE",
  },
};

export const validationSchema = Yup.object({
  date: Yup.date().required("Required"),
  startTime: Yup.string().required("Required"),
  endTime: Yup.string().required("Required"),
  eventType: Yup.string().required("Required"),
  numberOfGuests: Yup.number().required("Required"),
  publicEvent: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  zipcode: Yup.string().required("Required"),
  customer: Yup.object({}).shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    phone: Yup.string().required("Required"),
  }),
});
