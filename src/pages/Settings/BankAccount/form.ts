import * as Yup from "yup";

export const initialValues = {
  iban: {
    ibanNumber: "",
    bicSwift: "",
    bankName: "",
    ibanHolderName: "",
    label: "",
  },
};

export const validationSchema = Yup.object().shape({
  iban: Yup.object().shape({
    ibanNumber: Yup.string().required("Required"),
    bicSwift: Yup.string().required("Required"),
    bankName: Yup.string().required("Required"),
    ibanHolderName: Yup.string().required("Required"),
    label: Yup.string().required("Required"),
  }),
});
