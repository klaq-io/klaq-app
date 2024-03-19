import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { LoginLayout } from '../../layouts';
import { useLogin } from '../../redux/Login/hooks';
import { PATHS } from '../../routes';
import { initialValues, validationSchema } from './form';
import { Button } from 'components';
import KlaqLogo from '../../assets/klaq.png';
import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import backgroundAuth from 'assets/background-auth.jpeg';
import { useState } from 'react';

export const Login = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const [{ isLoading }, fetchUseLogin] = useLogin();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      fetchUseLogin(values.email, values.password);
    },
  });

  const handleForgetPassword = () => {
    navigate(PATHS.FORGET_PASSWORD);
  };

  return (
    <LoginLayout backgroundImg={backgroundAuth}>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-lg leading-6 font-semibold text-klaq-600">
              <img src={KlaqLogo} className="w-40 h-40" />
            </h1>
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {intl.formatMessage({
                id: 'login.header',
              })}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {intl.formatMessage({
                id: 'login.signup.text',
              })}
              <a
                href={PATHS.SIGN_UP}
                className="font-semibold text-klaq-600 hover:text-klaq-500"
              >
                {intl.formatMessage({
                  id: 'login.signup.link',
                })}
              </a>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: 'login.label.email',
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                      placeholder={intl.formatMessage({
                        id: 'login.input.email',
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: 'login.label.password',
                    })}
                  </label>
                  <div className="mt-2 relative">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      id="password"
                      name="password"
                      type={isPasswordHidden ? 'password' : 'text'}
                      autoComplete="current-password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                      placeholder={intl.formatMessage({
                        id: 'login.input.password',
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-klaq-500"
                      onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                    >
                      {isPasswordHidden ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    <a
                      onClick={handleForgetPassword}
                      className="font-semibold text-klaq-600 hover:text-klaq-500 cursor-pointer"
                    >
                      {intl.formatMessage({
                        id: 'login.forget-password',
                      })}
                    </a>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      isLoading={isLoading}
                      trailingIcon={
                        <ArrowRightIcon className="-mr-1 ml-2 h-5 w-5" />
                      }
                    >
                      {intl.formatMessage({
                        id: 'login.submit',
                      })}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default Login;
