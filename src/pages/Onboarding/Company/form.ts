import * as Yup from "yup";
import { CompanyLegalForm } from "../../../interface/suggestion.interface";

export const initialCompanyFormValues = {
  activityType: "",
  inseeLegalFormCode: "",
  legalForm: CompanyLegalForm.SAS,
  legalName: "",
  legalRegistrationNumber: "",
  legalVATNumber: "",
  registrationDate: "",
  address: "",
  city: "",
  zip: "",
  tradeName: "",
  country: "",
};

export const companyFormSchema = Yup.object().shape({
  activityType: Yup.string().required("Ce champ est requis"),
  inseeLegalFormCode: Yup.string().required("Ce champ est requis"),
  legalForm: Yup.string().required("Ce champ est requis"),
  legalName: Yup.string().required("Ce champ est requis"),
  legalRegistrationNumber: Yup.string().required("Ce champ est requis"),
  legalVATNumber: Yup.string(),
  registrationDate: Yup.string().required("Ce champ est requis"),
  address: Yup.string().required("Ce champ est requis"),
  city: Yup.string().required("Ce champ est requis"),
  zip: Yup.string().required("Ce champ est requis"),
  tradeName: Yup.string(),
  country: Yup.string().required("Ce champ est requis"),
});
