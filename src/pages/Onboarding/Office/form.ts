import * as Yup from "yup";

export enum SelectOptions {
  YES,
  NO,
}

export const initialValues = {
  officeAddress: "",
  officeCity: "",
  officeZip: "",
  officeCountry: "",
  select: SelectOptions.YES,
};

export const validationSchema = Yup.object().shape({
  officeAddress: Yup.string(),
  officeCity: Yup.string(),
  officeZip: Yup.string(),
  officeCountry: Yup.string(),
});
