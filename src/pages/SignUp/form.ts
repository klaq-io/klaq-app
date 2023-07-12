import * as Yup from "yup";

export const initialValues = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
};

export const validationSchema = Yup.object({
  email: Yup.string().required("Required"),
  password: Yup.string()
    .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{10,}$/)
    .required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
});
