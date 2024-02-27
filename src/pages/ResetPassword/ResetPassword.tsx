import { useFormik } from 'formik';
import { LoginLayout } from '../../layouts';
import { initialValues, validationSchema } from './form';
import { useResetPassword } from '../../redux/Login/hooks';
import { useIntl } from 'react-intl';
import { Button } from 'components';

export const ResetPassword = () => {
  const intl = useIntl();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const [, resetPassword] = useResetPassword();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (token) {
        resetPassword({ ...values, token });
      }
    },
  });

  return (
    <LoginLayout backgroundImg="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-lg leading-6 font-semibold text-klaq-600">
              Klaq.io
            </h1>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {intl.formatMessage({
                id: 'reset-password.header',
              })}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {intl.formatMessage({
                id: 'reset-password.text',
              })}
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: 'reset-password.label.password',
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: 'reset-password.input.password',
                      })}
                    />
                    {formik.errors.password && formik.touched.password ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: 'reset-password.error.password',
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: 'reset-password.label.password-confirmation',
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: 'reset-password.input.password-confirmation',
                      })}
                    />
                    {formik.errors.confirmPassword &&
                    formik.touched.confirmPassword ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: 'reset-password.error.password-confirmation',
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <Button type="submit" color="primary" variant="contained">
                    {intl.formatMessage({
                      id: 'reset-password.submit',
                    })}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};
