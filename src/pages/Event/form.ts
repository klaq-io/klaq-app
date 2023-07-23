import * as Yup from "yup";
import { CustomerType } from "../../redux/Customer/slices";

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

export const validationSchemaEdit = Yup.object({});
