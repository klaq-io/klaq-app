import { CustomerType } from "redux/Customer/slices";
import * as Yup from "yup";

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
  subEvents: [
    {
      date: "",
      startTime: "",
      endTime: "",
      address: "",
      city: "",
      zipcode: "",
      country: "",
      type: "",
      guests: 0,
      publicEvent: "true",
    },
  ],
  note: "",
};

export const validationSchema = Yup.object().shape({
  customer: Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string().required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    type: Yup.string().required("Required"),
  }),
  title: Yup.string(),
  note: Yup.string(),
  subEvents: Yup.array().of(
    Yup.object().shape({
      date: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      zipcode: Yup.string().matches(/^\d{5}$/, "Invalid zipcode"),
      type: Yup.string().required("Required"),
      guests: Yup.number(),
    })
  ),
});
