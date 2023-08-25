import * as Yup from "yup";
import { CustomerType } from "../../redux/Customer/slices";

export const initialValues = {
  date: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  eventType: "wedding",
  numberOfGuests: 0,
  publicEvent: "yes",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  coordinates: { longitude: 0, latitude: 0 },
  customer: {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "0606060606",
    type: CustomerType.PRIVATE,
  },
  products: [
    {
      id: "",
      quantity: 0,
      productId: "",
    },
  ],
};

export const validationSchema = Yup.object({
  date: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  startTime: Yup.string().required(),
  endTime: Yup.string().required(),
  eventType: Yup.string().required(),
  numberOfGuests: Yup.number().required(),
  publicEvent: Yup.string().required(),
  address: Yup.string().required(),
  city: Yup.string().required(),
  state: Yup.string().required(),
  zipcode: Yup.string().required(),
  country: Yup.string().required(),
});
