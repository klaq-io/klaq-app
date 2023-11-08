import {
  DocumentDuplicateIcon,
  LinkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ReactComponent as GoogleIcon } from "assets/icon-google.svg";
import { Button, Skeleton, ToastNotification } from "components";
import { format, subYears } from "date-fns";
import { useFormik } from "formik";
import { PageLayout } from "layouts";
import { FC, LegacyRef, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useFetchUser, useGoogleGenerateOAuthUrl } from "redux/Login/hooks";
import { getUser } from "redux/Login/selectors";
import { useDeleteLogo, useUpdateLogo, useUpdateUser } from "redux/User/hooks";
import {
  PrivateInformationSkeleton,
  PublicInformationSkeleton,
} from "./Skeleton";
import { initialValues, validationSchema } from "./form";
import { JellyTriangle } from "@uiball/loaders";
import toast from "react-hot-toast";

type Props = {};

export const Profile: FC<Props> = (props: Props) => {
  const intl = useIntl();
  const hiddenLogoInput: LegacyRef<HTMLInputElement> = useRef(null);

  const [{ isLoading: isFetchingUser }, fetchUser] = useFetchUser();
  const [{ isLoading: isFetchingUserPicture }, fetchUserPicture] =
    useFetchUser();
  const user = useSelector(getUser);

  const [{ isLoading }, updateUser] = useUpdateUser();
  const [{ isLoading: isUpdatingLogo }, updateLogo] = useUpdateLogo();
  const [{ isLoading: isDeletingPicture }, deleteLogo] = useDeleteLogo();

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

  useEffect(() => {
    fetchUser();
  }, []);

  const handleResetPersonalInfo = () => {
    formik.setValues({
      ...formik.values,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate
        ? format(new Date(user.birthDate), "yyyy-MM-dd")
        : "",
    });
  };

  const handleResetProfileInfo = () => {
    formik.setValues({
      ...formik.values,
      stageName: user.stageName,
      publicEmail: user.publicEmail,
      publicPhone: user.publicPhone,
    });
  };

  const handleGoToGoogleOAuth = async () => {
    const url = await getGoogleOAuthUrl();
    window.location.href = url;
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    await updateLogo(file);
    fetchUserPicture();
  };

  const handleFileUploadClick = () => {
    if (hiddenLogoInput.current) hiddenLogoInput.current.click();
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

  return (
    <PageLayout>
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.profile.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.profile.description",
              })}
            </p>
          </div>

          {isFetchingUser ? (
            <PublicInformationSkeleton />
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.profile.label.stage-name",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.stageName}
                        onChange={formik.handleChange}
                        type="text"
                        name="stageName"
                        id="stageName"
                        placeholder={intl.formatMessage({
                          id: "settings.profile.input.stage-name",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.stageName && formik.touched.stageName ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.profile.label.public-email",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        id="publicEmail"
                        name="publicEmail"
                        type="email"
                        value={formik.values.publicEmail}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.profile.input.public-email",
                        })}
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.publicEmail &&
                      formik.touched.publicEmail ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.profile.label.public-phone",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        id="publicPhone"
                        name="publicPhone"
                        type="text"
                        value={formik.values.publicPhone}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.profile.input.public-phone",
                        })}
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.publicPhone &&
                      formik.touched.publicPhone ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {intl.formatMessage({
                        id: "settings.profile.label.website",
                      })}
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-klaq-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          http://
                        </span>
                        <input
                          value={formik.values.website}
                          onChange={formik.handleChange}
                          type="text"
                          name="website"
                          id="website"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder={intl.formatMessage({
                            id: "settings.profile.input.website",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  onClick={handleResetProfileInfo}
                >
                  {intl.formatMessage({
                    id: "settings.button.cancel",
                  })}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="lg"
                  isLoading={isLoading}
                >
                  {intl.formatMessage({
                    id: "settings.button.submit",
                  })}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.personal.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.personal.description",
              })}
            </p>
          </div>

          {isFetchingUser ? (
            <PrivateInformationSkeleton />
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.personal.label.first-name",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder={intl.formatMessage({
                          id: "settings.personal.input.first-name",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.firstName && formik.touched.firstName ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.personal.label.last-name",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={intl.formatMessage({
                          id: "settings.personal.input.last-name",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.lastName && formik.touched.lastName ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.personal.label.birthday",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.birthDate}
                        onChange={formik.handleChange}
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        max={
                          subYears(new Date(), 18).toISOString().split("T")[0]
                        }
                        placeholder={intl.formatMessage({
                          id: "settings.personal.input.birthday",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.birthDate && formik.touched.birthDate ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {intl.formatMessage({
                        id: "settings.personal.label.email",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        disabled={true}
                        placeholder={intl.formatMessage({
                          id: "settings.personal.input.email",
                        })}
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.email && formik.touched.email ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {intl.formatMessage({
                        id: "settings.personal.label.phone",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        disabled={true}
                        placeholder={intl.formatMessage({
                          id: "settings.personal.input.phone",
                        })}
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.phone && formik.touched.phone ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.profile.error.stage-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  onClick={handleResetPersonalInfo}
                >
                  {intl.formatMessage({
                    id: "settings.button.cancel",
                  })}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="lg"
                  isLoading={isLoading}
                >
                  {intl.formatMessage({
                    id: "settings.button.submit",
                  })}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.profile.logo.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.profile.logo.description",
              })}
            </p>
          </div>
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "settings.profile.logo.label",
                    })}
                  </h3>
                </div>
                <div className="col-span-full">
                  {isUpdatingLogo ||
                  isFetchingUserPicture ||
                  isDeletingPicture ? (
                    <UserCircleIcon
                      className="h-24 w-24 text-gray-300 animate-pulse"
                      aria-hidden="true"
                      onClick={handleFileUploadClick}
                    />
                  ) : user.logoUrl ? (
                    <img
                      src={user.logoUrl}
                      className="h-48 w-48 hover:cursor-pointer"
                      onClick={handleFileUploadClick}
                    />
                  ) : (
                    <UserCircleIcon
                      className="h-24 w-24 text-gray-300 hover:cursor-pointer"
                      aria-hidden="true"
                      onClick={handleFileUploadClick}
                    />
                  )}

                  <input
                    type="file"
                    className="hidden"
                    ref={hiddenLogoInput}
                    onChange={(event) => {
                      handleFileUpload(
                        event.target.files ? event.target.files[0] : null
                      );
                      event.preventDefault();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <Button
                type="button"
                variant="text"
                color="secondary"
                onClick={deleteLogo}
              >
                {intl.formatMessage({
                  id: "settings.button.delete",
                })}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                size="lg"
                onClick={handleFileUploadClick}
              >
                {intl.formatMessage({
                  id: "settings.profile.logo.change",
                })}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
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
                  {user.isGoogleOAuthActivated ? (
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
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.delete.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.delete.description",
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
                  <p className="text-sm leading-6 text-gray-600">
                    {intl.formatMessage({
                      id: "settings.delete.disclaimer",
                    })}
                  </p>
                </div>
                <div className="sm:col-span-full">
                  <button
                    disabled
                    type="button"
                    className="rounded-md bg-danger-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger-600"
                  >
                    {intl.formatMessage({
                      id: "settings.delete.button",
                    })}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};
