import { useAsyncCallback } from '@react-hooks-library/core';
import webClient from '../../utils/webclient';
import { ToastNotification } from 'components';
import toast from 'react-hot-toast';
import { useInitiateSMSVerification } from '../SMS/hooks';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes';

export const useCheckEmailVerifyingStatus = () => {
  const navigate = useNavigate();
  const [, initiateSMSVerification] = useInitiateSMSVerification();

  return useAsyncCallback(async (interval?: NodeJS.Timer) => {
    try {
      const { data } = await webClient.get('email-confirmation/status');

      const { isMailVerified } = data;

      if (isMailVerified) {
        if (interval) clearInterval(interval);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={`toast.success.confirmed-email.title`}
            messageId={`toast.success.confirmed-email.message`}
          />,
          { duration: 2000, position: 'top-right' },
        );
        initiateSMSVerification();
        navigate(PATHS.CONFIRM_SMS);
      }
    } catch {}
  });
};

export const useVerifyEmail = () => {
  const [, resendVerificationEmail] = useResendVerificationEmail();

  return useAsyncCallback(async (token: string) => {
    try {
      await webClient.post('email-confirmation/confirm', { token });
      return true;
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
      resendVerificationEmail();
      return false;
    }
  });
};

export const useResendVerificationEmail = () => {
  return useAsyncCallback(async () => {
    try {
      await webClient.post('email-confirmation/resend-confirmation-link');
      toast.custom(
        <ToastNotification
          status="success"
          titleId={`toast.success.resend-verify-email.title`}
          messageId={`toast.success.resend-verify-email.message`}
        />,
        { duration: 1500, position: 'top-right' },
      );
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
      return error.response;
    }
  });
};

export const useSendMail = () => {
  return useAsyncCallback(
    async (values: {
      to: string;
      subject: string;
      message: string;
      cc?: boolean;
    }) => {
      try {
        await webClient.post('email/send', values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={`toast.success.email-sent.title`}
            messageId={`toast.success.email-sent.message`}
          />,
          { duration: 1500, position: 'top-right' },
        );
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
        return error.response;
      }
    },
  );
};
