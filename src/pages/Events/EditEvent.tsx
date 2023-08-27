import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  Button,
  EventSummaryCard,
  MapAutocompleteInput,
  Map,
} from "../../components";
import { PageLayout } from "../../layouts";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../routes";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./form";
import { useEffect, useState } from "react";
import { RetrieveAddress } from "../../interface/retrieve-address.interface";
import { useSelector } from "react-redux";
import { getEventById } from "../../redux/Events/selectors";
import { useFetchEvent, useUpdateEvent } from "../../redux/Events/hooks";
import { EventDetailsSkeleton } from "../Event/Skeleton";

const eventType = ["wedding", "birthday", "corporate"];

export const EditEvent = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const [{ isLoading: isFetchingEvent }, fetchEvent] = useFetchEvent();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [{ isLoading: isUpdating }, updateEvent] = useUpdateEvent();

  const setAutocompleteValues = (retrieveAddress: RetrieveAddress) => {
    formik.setFieldValue("address", retrieveAddress.address);
    formik.setFieldValue("zipcode", retrieveAddress.zipcode);
    formik.setFieldValue("city", retrieveAddress.city);
    formik.setFieldValue("country", retrieveAddress.country);
    formik.setFieldValue("coordinates", retrieveAddress.coordinates);
  };

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...event,
    },
    validationSchema,
    onSubmit: async (values) => {
      const date = new Date(values.date);
      updateEvent({ ...values, date }, id!);
    },
    enableReinitialize: true,
  });

  const handlePrevious = () => {
    navigate(`${PATHS.EVENTS}/${id}?from=edit`);
  };

  useEffect(() => {
    fetchEvent(id!);
  }, []);

  return (
    <PageLayout>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Button
            variant="text"
            color="secondary"
            type="button"
            onClick={handlePrevious}
            leadingIcon={<ArrowLeftIcon className="-ml-0.5 h-5 w-5" />}
          >
            {intl.formatMessage({
              id: "edit-event.button.previous",
            })}
          </Button>
        </div>
        <div>
          <div className="flex flex-shrink-0 space-x-4">
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="xl"
              isLoading={isUpdating}
              onClick={formik.submitForm}
            >
              {intl.formatMessage({
                id: `edit-event.button.submit`,
              })}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        {isFetchingEvent ? (
          <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
              <EventDetailsSkeleton />
              {event && <EventSummaryCard event={event} />}
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pt-10">
              <EventDetailsSkeleton />
            </div>
          </div>
        ) : (
          <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
              <form
                onSubmit={formik.handleSubmit}
                className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
              >
                <div className="p-8">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                      <h3 className="text-base font-semibold leading-7 text-klaq-600">
                        {intl.formatMessage({
                          id: "event-details.informations.header",
                        })}
                      </h3>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.type",
                        })}
                      </label>
                      <div className="mt-2">
                        <select
                          onChange={formik.handleChange}
                          value={formik.values.eventType}
                          id="eventType"
                          name="eventType"
                          className="mt-2 block  rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        >
                          {eventType.map((type) => (
                            <option key={type} value={type}>
                              {intl.formatMessage({
                                id: `new-event.date.input.event-type.${type}`,
                              })}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.number-of-guests",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.numberOfGuests}
                          type="number"
                          name="numberOfGuests"
                          id="numberOfGuest"
                          className="block  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.public-event",
                        })}
                      </label>
                      <div className="mt-2">
                        <select
                          onChange={formik.handleChange}
                          value={formik.values.publicEvent}
                          id="publicEvent"
                          name="publicEvent"
                          className="mt-2 block  rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.start-date",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.date.toString()}
                          type="date"
                          name="date"
                          id="date"
                          className="block  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.end-date",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.date.toString()}
                          type="date"
                          name="date"
                          id="date"
                          className="block  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.start-time",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.startTime}
                          type="time"
                          name="startTime"
                          id="startTime"
                          className="block  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.end-time",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.endTime}
                          type="time"
                          name="endTime"
                          id="endTime"
                          className="block  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {event && <EventSummaryCard event={event} />}
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pt-10">
              <form
                onSubmit={formik.handleSubmit}
                className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
              >
                <div className="p-8">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                      <h3 className="text-base font-semibold leading-7 text-klaq-600">
                        {intl.formatMessage({
                          id: "event-details.location.header",
                        })}
                      </h3>
                    </div>
                    <div className="sm:col-span-full">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "edit-event.label.autocomplete",
                        })}
                      </label>
                      <div className="mt-2">
                        {event && !isFetchingEvent && (
                          <MapAutocompleteInput
                            setAddress={setAutocompleteValues}
                            defaultAddress={`${formik.values.address} ${formik.values.zipcode} ${formik.values.city} ${formik.values.country}`}
                          />
                        )}
                      </div>
                      <div className="sm:col-span-full">
                        <div className="relative w-full mt-6">
                          <div
                            className="absolute inset-0 flex items-center w-full"
                            aria-hidden="true"
                          >
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-sm text-gray-500">
                              {intl.formatMessage({
                                id: "edit-event.label.manual",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.address",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.address}
                          type="text"
                          name="address"
                          id="address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.zip",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.zipcode}
                          type="text"
                          name="zipcode"
                          id="zipcode"
                          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.city",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.city}
                          type="text"
                          name="city"
                          id="city"
                          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.country",
                        })}
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.country}
                          type="text"
                          name="country"
                          id="country"
                          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                          placeholder={intl.formatMessage({
                            id: "new-event.location.input.country",
                          })}
                        />
                        {formik.errors.country && formik.touched.country ? (
                          <p
                            className="mt-2 text-sm text-danger-600"
                            id="email-error"
                          >
                            {intl.formatMessage({
                              id: "new-event.location.error.country",
                            })}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                {event && !isFetchingEvent && formik.values.coordinates && (
                  <Map
                    zoom={12}
                    longitude={formik.values.coordinates.longitude}
                    latitude={formik.values.coordinates.latitude}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default EditEvent;
