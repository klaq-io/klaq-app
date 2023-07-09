import { useFormik } from "formik";
import { useIntl } from "react-intl";
import PhoneInput from "react-phone-input-2";
import { PageLayout } from "../../layouts";
import { useAddEvent } from "../../redux/Events/hooks";
import { initialValues, validationSchema } from "./form";

export const NewEvent = () => {
  const intl = useIntl();
  const [, addEvent] = useAddEvent();

  const setPhoneNumber = (phone: string) => {
    formik.setValues({
      ...formik.values,
      phoneNumber: phone,
    });
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      addEvent(values);
    },
  });

  // TODO: call an enum instead
  const eventType = ["wedding", "birthday", "corporate"];

  return (
    <PageLayout>
      <form onSubmit={formik.handleSubmit}>
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {intl.formatMessage({
                id: "new-event.title",
              })}
            </h2>
          </div>
        </div>
        {/** Date */}
        <div className="flex flex-row">
          <div className="flex-1 mt-10">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-blue-600">
                {intl.formatMessage({
                  id: "new-event.date.header",
                })}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {intl.formatMessage({
                  id: "new-event.date.description",
                })}
              </p>
            </div>
            <div className="mt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.date.label.date",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.date}
                      type="date"
                      name="date"
                      id="date"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    {formik.errors.date && formik.touched.date ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.date.error.date",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.date.label.number-of-guest",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.numberOfGuests}
                      type="number"
                      name="numberOfGuests"
                      id="numberOfGuest"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.date.label.start-time",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.startTime}
                      type="time"
                      name="startTime"
                      id="startTime"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    {formik.errors.startTime && formik.touched.startTime ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.date.error.start-time",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.date.label.end-time",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.endTime}
                      type="time"
                      name="endTime"
                      id="endTime"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    {formik.errors.endTime && formik.touched.endTime ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.date.error.end-time",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.date.label.event-type",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <select
                      onChange={formik.handleChange}
                      value={formik.values.eventType}
                      id="eventType"
                      name="eventType"
                      className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                      {eventType.map((type) => (
                        <option key={type} value={type}>
                          {intl.formatMessage({
                            id: `new-event.date.input.event-type.${type}`,
                          })}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.date.label.public-event",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <select
                      onChange={formik.handleChange}
                      value={formik.values.publicEvent}
                      id="publicEvent"
                      name="publicEvent"
                      className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                      defaultValue="yes"
                    >
                      <option value="yes">
                        {intl.formatMessage({
                          id: "new-event.date.input.public-event.yes",
                        })}
                      </option>
                      <option value="no">
                        {intl.formatMessage({
                          id: "new-event.date.input.public-event.no",
                        })}
                      </option>
                    </select>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex-1">calendar</div>
        </div>
        {/** Location */}
        <div className="flex flex-row">
          <div className="flex-1 mt-10">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-blue-600">
                {intl.formatMessage({
                  id: "new-event.location.header",
                })}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {intl.formatMessage({
                  id: "new-event.location.description",
                })}
              </p>
            </div>
            <div className="mt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.location.label.address",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      type="text"
                      name="address"
                      id="address"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "new-event.location.input.address",
                      })}
                    />
                    {formik.errors.address && formik.touched.address ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.location.error.address",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.location.label.city",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.city}
                      type="text"
                      name="city"
                      id="city"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "new-event.location.input.city",
                      })}
                    />
                    {formik.errors.city && formik.touched.city ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.location.error.city",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.location.label.state",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.state}
                      type="text"
                      name="state"
                      id="state"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "new-event.location.input.state",
                      })}
                    />
                    {formik.errors.state && formik.touched.state ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.location.error.state",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.location.label.zipcode",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.zipcode}
                      type="text"
                      name="zipcode"
                      id="zipcode"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "new-event.location.input.zipcode",
                      })}
                    />
                    {formik.errors.zipcode && formik.touched.zipcode ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.location.error.zipcode",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex-1">map</div>
        </div>
        {/** Customer */}
        <div className="flex flex-row">
          <div className="flex-1 mt-10">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-blue-600">
                {intl.formatMessage({
                  id: "new-event.customer.header",
                })}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {intl.formatMessage({
                  id: "new-event.customer.description",
                })}
              </p>
            </div>
            <div className="mt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.customer.label.first-name",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.firstName}
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "new-event.customer.input.first-name",
                      })}
                    />
                    {formik.errors.firstName && formik.touched.firstName ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.customer.error.first-name",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.customer.label.last-name",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.lastName}
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "new-event.customer.input.last-name",
                      })}
                    />
                    {formik.errors.lastName && formik.touched.lastName ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.customer.error.last-name",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.customer.label.phone-number",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.phoneNumber}
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="+33 6 12 34 56 78"
                    />
                    {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.customer.error.phone-number",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.customer.label.email",
                    })}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      type="text"
                      name="email"
                      id="email"
                      className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "new-event.customer.input.email",
                      })}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        id="email-error"
                      >
                        {intl.formatMessage({
                          id: "new-event.customer.error.email",
                        })}
                      </p>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex-1">additionnal information</div>
        </div>
        <button
          type="submit"
          className="mt-10 w-1/4 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {intl.formatMessage({
            id: "new-event.submit",
          })}
        </button>
      </form>
    </PageLayout>
  );
};

export default NewEvent;
