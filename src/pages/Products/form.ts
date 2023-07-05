import * as Yup from "yup";

export const initialValues = {
  title: "",
  shortDescription: "",
  files: [],
  price: 0,
  vtaRate: 20,
};

export const validationSchema = Yup.object({
  title: Yup.string().required("Required"),
  shortDescription: Yup.string().required("Required"),
  files: Yup.array(),
  price: Yup.number().min(1).required("Required"),
  vtaRate: Yup.number().required("Required"),
});
