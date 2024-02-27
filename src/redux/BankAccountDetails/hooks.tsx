import { useAsyncCallback } from '@react-hooks-library/core';
import { ToastNotification } from 'components';
import { BankAccountDetails } from 'interface/User/bank-account-details.interface';
import toast from 'react-hot-toast';
import webClient from 'utils/webclient';
import * as ibantools from 'ibantools';

export const useFetchBankAccountDetails = () => {
  return useAsyncCallback(async () => {
    try {
      const { data } = await webClient.get(`/bank-account-details`);
      return data;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  });
};

export const useAddBankAccountDetails = () => {
  return useAsyncCallback(async (bankAccountDetails: BankAccountDetails) => {
    const iban = ibantools.electronicFormatIBAN(bankAccountDetails.accountIBAN);
    if (iban && !ibantools.isValidIBAN(iban)) {
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.invalid-iban.title`}
          messageId={`toast.error.invalid-iban.message`}
        />,
        { duration: 1500, position: 'top-right' },
      );
      return;
    }
    if (
      bankAccountDetails.accountBicSwift &&
      !ibantools.isValidBIC(bankAccountDetails.accountBicSwift)
    ) {
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.invalid-bic.title`}
          messageId={`toast.error.invalid-bic.message`}
        />,
        { duration: 1500, position: 'top-right' },
      );
      return;
    }
    try {
      const res = await webClient.put(
        `/bank-account-details`,
        bankAccountDetails,
      );
      toast.custom(
        <ToastNotification
          status="success"
          titleId={`toast.success.bank-account-details.title`}
          messageId={`toast.success.bank-account-details.message`}
        />,
        {
          duration: 1500,
          position: 'top-right',
        },
      );
      return res.data;
    } catch (error: any) {
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : 'default';
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.${code}.title`}
          messageId={`toast.error.${code}.message`}
        />,
        { duration: 1500, position: 'top-right' },
      );
      console.error(error);
      return error.data;
    }
  });
};
