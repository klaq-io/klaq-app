import { createSlice } from "@reduxjs/toolkit";
import { CompanyLegalForm } from "../../interface/suggestion.interface";
import { initialState } from "../states";

export interface Company {
  id: string;
  activityType?: string;
  inseeLegalFormCode?: string;
  legalForm: CompanyLegalForm;
  legalName: string;
  legalRegistrationNumber: string;
  legalVATNumber?: string;
  registrationDate?: Date;
  address: string;
  city: string;
  zip: string;
  country: string;
  tradeName?: string;
  officeAddress: string;
  officeCity: string;
  officeZip: string;
  officeCountry: string;
}

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload;
    },
  },
});

export const { setCompany } = companySlice.actions;

export default companySlice.reducer;
