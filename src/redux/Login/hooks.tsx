import { useAsyncCallback } from '@react-hooks-library/core';
import { ToastNotification } from 'components';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { KlaqToast } from 'utils/KlaqToast';
import { PATHS } from '../../routes';
import webClient from '../../utils/webclient';
import { resetUser, setUser } from './slice';

export const useImpersonate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (userId?: string) => {
    try {
      if (!userId) return;
      const { data } = await webClient.post('auth/impersonate', { userId });
      if (data.user) dispatch(setUser(data.user));
      if (data.redirectURI) navigate(data.redirectURI);
      localStorage.setItem('impersonate', 'true');
    } catch (error: any) {
      KlaqToast('danger', 'impersonate', 5000);
      navigate(PATHS.DASHBOARD);
      console.error(error);
      return error.response;
    }
  });
};

export const useStopImpersonate = () => {
  const navigate = useNavigate();
  const [, signOut] = useSignout();

  return useAsyncCallback(async () => {
    try {
      localStorage.removeItem('impersonate');
      signOut();
      navigate(PATHS.LOGIN);
    } catch (error: any) {
      console.error(error);
      return error.response;
    }
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (email: string, password: string) => {
    try {
      const { data } = await webClient.post('auth/login', {
        email,
        password,
      });
      if (data.user) dispatch(setUser(data.user));
      if (data.redirectURI) navigate(data.redirectURI);
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

export const useSignout = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async () => {
    try {
      await webClient.get('auth/logout');
      dispatch(resetUser());
    } catch (error: any) {
      console.error(error);
      return error.response;
    }
  });
};

export const useFetchUser = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async () => {
    try {
      const res = await webClient.get('auth');
      dispatch(setUser(res.data));
      return res.data;
    } catch (error: any) {
      dispatch(resetUser());
      return error.response;
    }
  });
};

export const useSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(
    async (values: { email: string; password: string; phone: string }) => {
      try {
        const res = await webClient.post('auth/register', values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={'toast.success.register.title'}
            messageId={'toast.success.register.message'}
          />,
          { duration: 1500, position: 'top-right' },
        );
        dispatch(setUser(res.data));
        navigate(`${PATHS.CONFIRM_MAIL}?email=${values.email}`);
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
        return error.response;
      }
    },
  );
};

export const useRequestResetPassword = () => {
  return useAsyncCallback(async (values: { email: string }) => {
    try {
      const res = await webClient.post('auth/request-reset-password', values);
      toast.custom(
        <ToastNotification
          status="success"
          titleId={'toast.success.request-reset-password.title'}
          messageId={'toast.success.request-reset-password.message'}
        />,
        { duration: 1500, position: 'top-right' },
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
      return error.response;
    }
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useAsyncCallback(
    async (values: { password: string; token: string }) => {
      try {
        const res = await webClient.post('auth/reset-password', values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={'toast.success.reset-password.title'}
            messageId={'toast.success.reset-password.message'}
          />,
          { duration: 1500, position: 'top-right' },
        );
        navigate(PATHS.LOGIN);
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
        return error.response;
      }
    },
  );
};

export const useCheckAuth = () => {
  return useAsyncCallback(async () => {
    try {
      const res = await webClient.get('auth');
      return res.data;
    } catch (error: any) {
      console.error(error);
      return undefined;
    }
  });
};

export const useGoogleGenerateOAuthUrl = () => {
  return useAsyncCallback(async () => {
    try {
      const res = await webClient.get('google/oauth/url');
      return res.data;
    } catch (error: any) {
      return undefined;
    }
  });
};
