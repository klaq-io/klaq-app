import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { Company, Coordinates, setCompany } from "./slices";
import { toast } from "react-hot-toast";
import { ToastNotification } from "components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";

export const useFetchSuggestions = () => {
  return useAsyncCallback(async (query: string) => {
    try {
      const response = await webClient.get(`/company/suggestions?q=${query}`);
      return response.data;
    } catch (error: any) {
      console.error(error);
    }
  });
};

export const useFetchCompany = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async () => {
    try {
      const response = await webClient.get("/company");
      dispatch(setCompany(response.data));
      return response.data;
    } catch (error: any) {
      console.error(error);
    }
  });
};

export const useFetchCompanyInformation = () => {
  return useAsyncCallback(async (legalRegistratioNumber) => {
    try {
      const response = await webClient.get(
        `/company/information?legalRegistrationNumber=${legalRegistratioNumber}`
      );
      return response.data;
    } catch (error: any) {
      console.error(error);
    }
  });
};

export const useCreateCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(
    async (values: {
      activityType?: string;
      inseeLegalFormCode?: string;
      legalForm: string;
      legalName: string;
      legalRegistrationNumber: string;
      legalVATNumber?: string;
      registrationDate?: Date;
      address: string;
      city: string;
      zip: string;
      tradeName?: string;
      country: string;
    }) => {
      try {
        const response = await webClient.post("/company", values);
        dispatch(setCompany(response.data));
        toast.custom(
          <ToastNotification
            titleId={`toast.success.create-company.title`}
            messageId={`toast.success.create-company.message`}
            status="success"
          />,
          { duration: 1500, position: "top-right" }
        );
        navigate(PATHS.ONBOARDING_PERFORMER);
        return response.data;
      } catch (error: any) {
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : "default";
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`toast.error.${code}.title`}
            messageId={`toast.error.${code}.message`}
          />,
          { duration: 1500, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};

export const useUpdateCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(
    async (values: {
      activityType?: string;
      inseeLegalFormCode?: string;
      legalForm?: string;
      legalName?: string;
      legalRegistrationNumber?: string;
      legalVATNumber?: string;
      registrationDate?: Date;
      address?: string;
      city?: string;
      zip?: string;
      tradeName?: string;
      country?: string;
      officeAddress?: string;
      officeCity?: string;
      officeZip?: string;
      officeCountry?: string;
      officeCoordinates?: Coordinates;
    }) => {
      try {
        const res = await webClient.put("/company", values);
        dispatch(setCompany(res.data));
        toast.custom(
          <ToastNotification
            titleId={`toast.success.update-office.title`}
            messageId={`toast.success.update-office.message`}
            status="success"
          />,
          { duration: 1500, position: "top-right" }
        );
      } catch (error: any) {
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : "default";
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`toast.error.${code}.title`}
            messageId={`toast.error.${code}.message`}
          />,
          { duration: 1500, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};
