import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { setCompany } from "./slices";
import { toast } from "react-hot-toast";
import { ToastNotification } from "../../components";
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
            titleId={`onboarding.company-form.toast.success.title`}
            messageId={`onboarding.company-form.toast.success.message`}
            status="success"
          />
        );
        navigate(PATHS.ONBOARDING_PERFORMER);
        return response.data;
      } catch (error: any) {
        toast.custom(
          <ToastNotification
            titleId={`onboarding.company-form.toast.error.${error.response.data.code}.title`}
            messageId={`onboarding.company-form.toast.error.${error.response.data.code}.message`}
            status="danger"
          />
        );
        console.error(error);
      }
    }
  );
};
