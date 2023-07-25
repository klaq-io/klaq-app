import { CustomerType } from "../../redux/Customer/slices";
import * as Yup from "yup";

export const initialValues = {
  type: CustomerType.PRIVATE,
  name: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  zipcode: "",
  city: "",
  country: "",
  legalVATNumber: "",
  legalRegistrationNumber: "",
};

export const validationSchema = Yup.object().shape({
  type: Yup.mixed().oneOf(Object.values(CustomerType)).required("Required"),
  name: Yup.string(),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  siret: Yup.string(),
  address: Yup.string(),
  zipCode: Yup.string(),
  city: Yup.string(),
  country: Yup.string(),
  vatNumber: Yup.string(),
});
