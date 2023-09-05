import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../layouts/OnboardingLayout/OnboardingLayout";
import { PATHS } from "../../routes";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./form";
import PhoneInput from "react-phone-input-2";
import { Button } from "components";
import { useSignUp } from "../../redux/Login/hooks";

export const SignUp = () => {
  const intl = useIntl();

  const [{ isLoading }, signUp] = useSignUp();

  const setPhoneNumber = (value: string) => {
    formik.setFieldValue("phone", value);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      signUp(values);
    },
  });
  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1518709911915-712d5fd04677?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=388&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "sign-up.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: "forget-password.login.text",
          })}{" "}
          <a
            href={PATHS.LOGIN}
            className="font-semibold text-klaq-600 hover:text-klaq-500"
          >
            {intl.formatMessage({
              id: "forget-password.login.link",
            })}
          </a>
        </p>
      </div>
      <div className="mt-10">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "sign-up.label.email",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.email}
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "sign-up.input.email",
                })}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="mt-2 text-sm text-danger-600" id="email-error">
                  {intl.formatMessage({
                    id: "sign-up.error.email",
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "sign-up.label.password",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.password}
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "sign-up.input.password",
                })}
              />
              {formik.errors.password && formik.touched.password ? (
                <p className="mt-2 text-sm text-danger-600" id="email-error">
                  {intl.formatMessage({
                    id: "sign-up.error.password",
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "sign-up.label.phone",
              })}
            </label>
            <div className="mt-2">
              <PhoneInput
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true,
                  className:
                    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6",
                }}
                country={"fr"}
                value={formik.values.phone}
                onChange={setPhoneNumber}
                enableAreaCodes={false}
                autoFormat={true}
                specialLabel=""
                showDropdown={false}
                disableDropdown={false}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <p className="mt-2 text-sm text-danger-600" id="email-error">
                  {intl.formatMessage({
                    id: "sign-up.error.phone",
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <div className="w-full mt-8"></div>
          <Button
            isLoading={isLoading}
            color="primary"
            variant="contained"
            type="submit"
          >
            {intl.formatMessage({
              id: "sign-up.submit",
            })}
          </Button>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default SignUp;
