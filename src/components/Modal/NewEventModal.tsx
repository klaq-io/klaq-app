import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Alert } from "components/Alert/Alert";
import { Button } from "components/Button";
import { Label, SelectField, TextField } from "components/Fields";
import { MapAutocompleteInput } from "components/Map";
import { format } from "date-fns";
import { useFormik } from "formik";
import { RetrieveAddress } from "interface/retrieve-address.interface";
import { initialValues, validationSchema } from "pages/Events/newEventForm";
import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchCustomers } from "redux/Customer/hooks";
import { getCustomers } from "redux/Customer/selectors";
import { Customer, CustomerType } from "redux/Customer/slices";
import { useCreateEvent } from "redux/MainEvent/hooks";
import { PATHS } from "routes";
import { classNames } from "utils/utils";

type NewEventModalProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  suggestedDate?: Date | null;
  suggestedCustomer?: Customer | null;
};

export const NewEventModal = (props: NewEventModalProps) => {
  const { isOpen, setOpen, suggestedDate, suggestedCustomer } = props;
  const intl = useIntl();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [isMapAutocompleteEnabled, setMapAutocompleteEnabled] = useState(true);
  const [isCustomerAutocompleteEnabled, setCustomerAutocompleteEnabled] =
    useState(true);

  const [, fetchCustomers] = useFetchCustomers();
  const customers = useSelector(getCustomers);

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter((customer) => {
          return customer.name.toLowerCase().includes(query.toLowerCase());
        });

  const [{ isLoading: isCreatingEvent }, createEvent] = useCreateEvent();

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      customer: {
        ...initialValues.customer,
        ...suggestedCustomer,
      },
      subEvents: [
        {
          ...initialValues.subEvents[0],
          date: suggestedDate
            ? format(suggestedDate, "yyyy-MM-dd")
            : initialValues.subEvents[0].date,
        },
      ],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { id } = await createEvent({
        ...values,
        customer: {
          ...values.customer,
          name: `${values.customer.firstName} ${values.customer.lastName}`,
        },
        subEvents: values.subEvents.map((subEvent) => ({
          ...subEvent,
          type: values.title,
        })),
      });
      setOpen(false);
      resetForm();
      navigate(`${PATHS.EVENT}/${id}/details`);
    },
    enableReinitialize: true,
  });

  const handleRetrieveAddress = (
    retrievedAddress: RetrieveAddress,
    eventIndex: number
  ) => {
    formik.setValues({
      ...formik.values,
      subEvents: formik.values.subEvents.map((kEvent, index) => {
        if (index !== eventIndex) {
          return kEvent;
        }
        return {
          ...kEvent,
          address: retrievedAddress.address,
          city: retrievedAddress.city,
          zipcode: retrievedAddress.zipcode,
          country: retrievedAddress.country,
        };
      }),
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setCustomerAutocompleteEnabled(true);
      setMapAutocompleteEnabled(true);
    }
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: "new-event.title",
                    })}
                  </Dialog.Title>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-4">
                      {formik.errors.subEvents &&
                        formik.errors.subEvents[0] &&
                        formik.touched.subEvents &&
                        formik.touched.subEvents[0] && (
                          <div className="col-span-full">
                            <Alert status="danger" title="Erreur">
                              Les champs "type d'évènement", "date" et "adresse"
                              sont obligatoires pour créer un évènement
                            </Alert>
                          </div>
                        )}
                      {formik.errors.customer && formik.touched.customer && (
                        <div className="col-span-full">
                          <Alert status="danger" title="Erreur">
                            Tous les champs de la fiche client doivent être
                            remplis pour valider le formulaire
                          </Alert>
                        </div>
                      )}
                      <div className="col-span-2">
                        <TextField
                          label="Type d'évènement*"
                          placeholder="Mariage, vin d'honneur, baptême, etc."
                          name="title"
                          onChange={formik.handleChange}
                          value={formik.values.title}
                        />
                      </div>
                      <div className="col-span-1">
                        <TextField
                          label={intl.formatMessage({
                            id: "new-event.date.label.number-of-guest",
                          })}
                          min={0}
                          type="number"
                          name={`subEvents.${0}.guests`}
                          onChange={formik.handleChange}
                          value={formik.values.subEvents[0].guests}
                        />
                      </div>
                      <div className="col-span-1">
                        <TextField
                          type="date"
                          label={intl.formatMessage({
                            id: "new-event.date.label.date",
                          })}
                          name={`subEvents.${0}.date`}
                          onChange={formik.handleChange}
                          value={formik.values.subEvents[0].date}
                        />
                      </div>
                      <div className="col-span-1">
                        <TextField
                          type="time"
                          label={intl.formatMessage({
                            id: "new-event.date.label.start-time",
                          })}
                          name={`subEvents.${0}.startTime`}
                          onChange={formik.handleChange}
                          value={formik.values.subEvents[0].startTime}
                        />
                      </div>
                      <div className="col-span-1">
                        <TextField
                          type="time"
                          label={intl.formatMessage({
                            id: "new-event.date.label.end-time",
                          })}
                          name={`subEvents.${0}.endTime`}
                          onChange={formik.handleChange}
                          value={formik.values.subEvents[0].endTime}
                        />
                      </div>
                      <div className="col-span-full">
                        <Label htmlFor="note">
                          Informations complémentaires sur l’événement
                        </Label>
                        <textarea
                          value={formik.values.note}
                          onChange={formik.handleChange}
                          rows={4}
                          name="note"
                          id="text"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                          placeholder={intl.formatMessage({
                            id: "edit-event.commentaries.add-commentary",
                          })}
                        />
                      </div>
                      {isMapAutocompleteEnabled ? (
                        <div className="col-span-full">
                          <Label htmlFor="address">
                            Lieu de l'évènement principal*{" "}
                            <Button
                              variant="link"
                              color="primary"
                              type="button"
                              onClick={() => setMapAutocompleteEnabled(false)}
                            >
                              (ou remplir manuellement)
                            </Button>
                          </Label>
                          <MapAutocompleteInput
                            defaultAddress={``}
                            setAddress={(address) =>
                              handleRetrieveAddress(address, 0)
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <div className="col-span-full">
                            <Label htmlFor="address">
                              {intl.formatMessage({
                                id: "new-event.location.label.address",
                              })}{" "}
                              <Button
                                variant="link"
                                color="primary"
                                type="button"
                                onClick={() => setMapAutocompleteEnabled(true)}
                              >
                                (ou remplir automatiquement)
                              </Button>
                            </Label>
                            <TextField
                              placeholder={intl.formatMessage({
                                id: "new-event.location.input.address",
                              })}
                              name={`subEvents.${0}.address`}
                              onChange={formik.handleChange}
                              value={formik.values.subEvents[0].address}
                            />
                          </div>
                          <div className="col-span-1">
                            <TextField
                              label={intl.formatMessage({
                                id: "new-event.location.label.zipcode",
                              })}
                              placeholder={intl.formatMessage({
                                id: "new-event.location.input.zipcode",
                              })}
                              name={`subEvents.${0}.zipcode`}
                              onChange={formik.handleChange}
                              value={formik.values.subEvents[0].zipcode}
                            />
                          </div>
                          <div className="col-span-1">
                            <TextField
                              label={intl.formatMessage({
                                id: "new-event.location.label.city",
                              })}
                              placeholder={intl.formatMessage({
                                id: "new-event.location.input.city",
                              })}
                              name={`subEvents.${0}.city`}
                              onChange={formik.handleChange}
                              value={formik.values.subEvents[0].city}
                            />
                          </div>
                          <div className="col-span-1">
                            <TextField
                              label={intl.formatMessage({
                                id: "new-event.location.label.country",
                              })}
                              placeholder={intl.formatMessage({
                                id: "new-event.location.input.country",
                              })}
                              name={`subEvents.${0}.country`}
                              onChange={formik.handleChange}
                              value={formik.values.subEvents[0].country}
                            />
                          </div>
                        </>
                      )}
                      {isCustomerAutocompleteEnabled ? (
                        <div className="col-span-full">
                          <Combobox as="div" value={formik.values.customer}>
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                              {intl.formatMessage({
                                id: "new-event.customer.label.attach-customer",
                              })}{" "}
                              <Button
                                variant="link"
                                color="primary"
                                type="button"
                                onClick={() => {
                                  setCustomerAutocompleteEnabled(false);
                                  formik.setFieldValue(
                                    "customer",
                                    initialValues.customer
                                  );
                                }}
                              >
                                (ou créer un nouveau client)
                              </Button>
                            </Combobox.Label>
                            <div className="relative mt-2">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                }
                                displayValue={(customer: Customer) =>
                                  customer ? customer.name : ""
                                }
                              />
                              <Combobox.Button className="absolute inset-y-0 pl-3 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>
                            </div>

                            {filteredCustomers && (
                              <Combobox.Options className="absolute z-40 mt-1 w-full max-w-lg max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredCustomers.length > 0 &&
                                  filteredCustomers
                                    .slice(0, 4)
                                    .map((customer) => (
                                      <Combobox.Option
                                        key={customer.id}
                                        value={customer}
                                        className={({ active }) =>
                                          classNames(
                                            "relative cursor-default select-none py-2 pl-3 pr-9",
                                            active
                                              ? "bg-klaq-600 text-white"
                                              : "text-gray-900"
                                          )
                                        }
                                        onClick={() =>
                                          formik.setFieldValue(
                                            "customer",
                                            customer
                                          )
                                        }
                                      >
                                        {({ active, selected }) => (
                                          <>
                                            <span
                                              className={classNames(
                                                "block truncate",
                                                selected && "font-semibold"
                                              )}
                                            >
                                              {customer.name}
                                            </span>

                                            {selected && (
                                              <span
                                                className={classNames(
                                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                                  active
                                                    ? "text-white"
                                                    : "text-klaq-600"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            )}
                                          </>
                                        )}
                                      </Combobox.Option>
                                    ))}
                                {query !== "" &&
                                  filteredCustomers.length === 0 && (
                                    <div className="px-4 py-8 text-center sm:px-8">
                                      {/* //todo: intl */}
                                      <UsersIcon
                                        className="mx-auto h-6 w-6 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <p className="mt-4 text-sm text-gray-900">
                                        Aucun client n'a été trouvé avec ces
                                        termes de recherches. Vous pouvez
                                        remplir manuellement les champs
                                        ci-dessous
                                      </p>
                                    </div>
                                  )}
                              </Combobox.Options>
                            )}
                          </Combobox>
                        </div>
                      ) : (
                        <>
                          <div className="col-span-1">
                            <SelectField
                              label={intl.formatMessage({
                                id: "new-event.customer.label.type",
                              })}
                              name="customer.type"
                              onChange={formik.handleChange}
                              value={formik.values.customer.type}
                            >
                              <option
                                key={CustomerType.PRIVATE}
                                value={CustomerType.PRIVATE}
                              >
                                {intl.formatMessage({
                                  id: "new-event.customer.type.private",
                                })}
                              </option>
                              <option
                                key={CustomerType.COMPANY}
                                value={CustomerType.COMPANY}
                              >
                                {intl.formatMessage({
                                  id: "new-event.customer.type.company",
                                })}
                              </option>
                            </SelectField>
                          </div>
                          <div className="col-span-1">
                            <TextField
                              label={intl.formatMessage({
                                id: "new-event.customer.label.first-name",
                              })}
                              placeholder={intl.formatMessage({
                                id: "new-event.customer.input.first-name",
                              })}
                              name="customer.firstName"
                              onChange={formik.handleChange}
                              value={formik.values.customer.firstName}
                            />
                          </div>
                          <div className="col-span-1">
                            <TextField
                              label={intl.formatMessage({
                                id: "new-event.customer.label.last-name",
                              })}
                              placeholder={intl.formatMessage({
                                id: "new-event.customer.input.last-name",
                              })}
                              name="customer.lastName"
                              onChange={formik.handleChange}
                              value={formik.values.customer.lastName}
                            />
                          </div>
                          <div className="col-span-1">
                            <TextField
                              label={intl.formatMessage({
                                id: "new-event.customer.label.phone-number",
                              })}
                              placeholder={intl.formatMessage({
                                id: "new-event.customer.input.phone-number",
                              })}
                              name="customer.phone"
                              onChange={formik.handleChange}
                              value={formik.values.customer.phone}
                            />
                          </div>
                          <div className="col-span-2">
                            <TextField
                              label={intl.formatMessage({
                                id: "new-event.customer.label.email",
                              })}
                              placeholder={intl.formatMessage({
                                id: "new-event.customer.input.email",
                              })}
                              name="customer.email"
                              onChange={formik.handleChange}
                              value={formik.values.customer.email}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-span-2">
                        <Label htmlFor="budget">Budget</Label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">€</span>
                          </div>
                          <input
                            onChange={formik.handleChange}
                            value={formik.values.budget}
                            type="number"
                            name="budget"
                            id="budget"
                            min={0}
                            step={10}
                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                            placeholder={"Saississez le budget du client"}
                            aria-describedby="price-currency"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span
                              className="text-gray-500 sm:text-sm"
                              id="price-currency"
                            >
                              EUR
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <SelectField
                          label={intl.formatMessage({
                            id: "new-event.date.label.public-event",
                          })}
                          onChange={formik.handleChange}
                          value={formik.values.subEvents[0].publicEvent}
                          name={`subEvents.${0}.publicEvent`}
                        >
                          <option value={"true"}>
                            {intl.formatMessage({
                              id: "new-event.date.input.public-event.yes",
                            })}
                          </option>
                          <option value={"false"}>
                            {intl.formatMessage({
                              id: "new-event.date.input.public-event.no",
                            })}
                          </option>
                        </SelectField>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="mt-4 sm:mt-8 w-full">
                  <Button
                    isLoading={isCreatingEvent}
                    type="button"
                    color="primary"
                    variant="contained"
                    onClick={formik.submitForm}
                  >
                    {intl.formatMessage({
                      id: "new-event.submit",
                    })}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
