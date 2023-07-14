import * as Yup from "yup";

export const initialValues = {
  stageName: "",
  firstName: "",
  lastName: "",
  publicEmail: "",
  publicPhone: "",
  category: "",
  birthDate: "",
};

export const validationSchema = Yup.object().shape({
  stageName: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  publicEmail: Yup.string().email("Invalid email").required("Required"),
  publicPhone: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  birthDate: Yup.date().required("Required"),
});
