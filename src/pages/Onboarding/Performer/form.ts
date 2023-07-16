import * as Yup from "yup";

enum selectOptions {
  YES,
  NO,
}

export const initialValues = {
  stageName: "",
  firstName: "",
  lastName: "",
  publicEmail: "",
  publicPhone: "",
  category: "",
  birthDate: "",
  selectPublicMail: selectOptions.YES,
  selectPublicPhone: selectOptions.YES,
};

export const validationSchema = Yup.object().shape({
  stageName: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  publicEmail: Yup.string().email("Invalid email").required("Required"),
  publicPhone: Yup.string().required("Required"),
  birthDate: Yup.date().required("Required"),
  category: Yup.string(),
});
