import * as Yup from "yup";

export const initialValues = {
  accountIBAN: "",
  accountBicSwift: "",
  accountHolder: "",
  label: "",
};

export const validationSchema = Yup.object().shape({
  accountIBAN: Yup.string().required("Required"),
  accountBicSwift: Yup.string().required("Required"),
  accountHolder: Yup.string().required("Required"),
  label: Yup.string().required("Required"),
});
