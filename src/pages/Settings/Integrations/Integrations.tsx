import { useFormik } from "formik";
import { PageLayout } from "layouts";
import { useIntl } from "react-intl";
import { initialValues, validationSchema } from "../Profile/form";
import { useFetchUser, useGoogleGenerateOAuthUrl } from "redux/Login/hooks";
import { useEffect } from "react";
import { useUpdateUser } from "redux/User/hooks";
import { useSelector } from "react-redux";
import { getUser } from "redux/Login/selectors";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Button, Skeleton, ToastNotification } from "components";
import { DocumentDuplicateIcon, LinkIcon } from "@heroicons/react/24/outline";
import { ReactComponent as GoogleIcon } from "assets/icon-google.svg";

export const Integrations = () => {
  const intl = useIntl();

  const [{ isLoading: isFetchingUser }, fetchUser] = useFetchUser();
  const [{ isLoading }, updateUser] = useUpdateUser();
  const user = useSelector(getUser);

  const [, getGoogleOAuthUrl] = useGoogleGenerateOAuthUrl();

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...user,
      birthDate: user.birthDate
        ? format(new Date(user.birthDate), "yyyy-MM-dd")
        : "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateUser(values);
    },
    enableReinitialize: true,
  });

  const handleGoToGoogleOAuth = async () => {
    const url = await getGoogleOAuthUrl();
    window.location.href = url;
  };

  const iframeLink = `<iframe loading="lazy" src="https://app.klaq.io/embedded-form?token=${user.id}" width="100%" height="540" frameborder="0" marginheight="0" marginwidth="0"><br /></iframe>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(iframeLink);
    toast.custom(
      <ToastNotification
        messageId="toast.info.copy-clipboard.message"
        titleId="toast.info.copy-clipboard.title"
        status="info"
      />,
      { duration: 1500, position: "top-right" }
    );
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <PageLayout>
      <div className="space-y-8 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.enquiry.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.enquiry.description",
              })}
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "settings.enquiry.form.header",
                    })}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {intl.formatMessage({
                      id: "settings.enquiry.form.description",
                    })}
                  </p>
                </div>
                <div className="sm:col-span-full">
                  <textarea
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    rows={3}
                    value={iframeLink}
                    disabled
                  />
                </div>
                <div className="sm:col-span-full">
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    size="lg"
                    leadingIcon={<DocumentDuplicateIcon className="h-5 w-5" />}
                    onClick={handleCopyCode}
                  >
                    Copier le code
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.social.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.social.description",
              })}
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {user.isGoogleOAuthActivated
                      ? intl.formatMessage({
                          id: "settings.social.social-login.header",
                        })
                      : intl.formatMessage({
                          id: "settings.social.no-social-login.header",
                        })}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {intl.formatMessage({
                      id: "settings.social.no-social-login.description",
                    })}
                  </p>
                </div>
                <div className="sm:col-span-full">
                  {!isFetchingUser && user ? (
                    user.isGoogleOAuthActivated ? (
                      <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                        leadingIcon={<GoogleIcon className="h-5 w-5" />}
                        size="lg"
                      >
                        <LinkIcon className="h-5 w-5 text-success-600" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                        leadingIcon={<GoogleIcon className="h-5 w-5" />}
                        size="lg"
                        onClick={handleGoToGoogleOAuth}
                      >
                        {intl.formatMessage({
                          id: "settings.social.no-social-login.button",
                        })}
                      </Button>
                    )
                  ) : (
                    <Skeleton variant={"rounded"} width={"full"} height={"8"} />
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};
