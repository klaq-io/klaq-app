import { Combobox } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  CheckIcon,
  UsersIcon,
  PlusIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  CardContainer,
  CommentaryFeed,
  Label,
  MapAutocompleteInput,
  SelectField,
  TextField,
  UploadDocumentZone,
} from "components";
import { useFormik } from "formik";
import { PageLayout } from "layouts";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useFetchCustomers } from "redux/Customer/hooks";
import { getCustomers } from "redux/Customer/selectors";
import { Customer, CustomerType } from "redux/Customer/slices";
import { classNames } from "utils/utils";
import { initialValues } from "./newEventForm";
import { RetrieveAddress } from "interface/retrieve-address.interface";
import { Alert } from "components/Alert/Alert";

export const NewEventV2 = () => {
  const intl = useIntl();

  const [{ isLoading }, fetchCustomers] = useFetchCustomers();
  const customers = useSelector(getCustomers);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [query, setQuery] = useState("");

  const [fileList, setFiles] = useState<File[]>([]);

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter((customer) => {
          return customer.name.toLowerCase().includes(query.toLowerCase());
        });

  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    enableReinitialize: true,
  });

  const handleLinkNewEvent = () => {
    const lastElement = formik.values.kEvents.at(-1);
    formik.setValues({
      ...formik.values,
      kEvents: [
        ...formik.values.kEvents,
        lastElement
          ? {
              ...initialValues.kEvents[0],
              date: lastElement.date,
              startTime: lastElement.endTime,
              //   address: lastElement.address,
              //   city: lastElement.city,
              //   zipcode: lastElement.zipcode,
              //   country: lastElement.country,
            }
          : initialValues.kEvents[0],
      ],
    });
  };

  const handleDuplicateNewEvent = () => {
    const lastElement = formik.values.kEvents.at(-1);

    formik.setValues({
      ...formik.values,
      kEvents: [
        ...formik.values.kEvents,
        { ...initialValues.kEvents[0], ...lastElement },
      ],
    });
  };

  const handleDeleteElement = (index: number) => {
    formik.setValues({
      ...formik.values,
      kEvents: formik.values.kEvents.filter((_, i) => i !== index),
    });
  };

  const handleRetrieveAddress = (
    retrievedAddress: RetrieveAddress,
    eventIndex: number
  ) => {
    formik.setValues({
      ...formik.values,
      kEvents: formik.values.kEvents.map((kEvent, index) => {
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

  return (
    <PageLayout>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {intl.formatMessage({
              id: "new-event.title",
            })}
          </h2>
        </div>
        <div>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={formik.handleSubmit}
          >
            {intl.formatMessage({
              id: "new-event.submit",
            })}
          </Button>
        </div>
      </div>
      <div className="mt-10"></div>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex space-x-8">
          {/* customer */}
          <div className="w-1/3">
            <CardContainer>
              <div className="flex-auto pl-6 pt-6 px-4 py-5 sm:p-6">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
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

              <div className="flex flex-col w-full border-t border-gray-900/4 px-4 py-5 sm:p-6 space-y-4">
                <Combobox
                  as="div"
                  value={selectedCustomer}
                  onChange={setSelectedCustomer}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "new-event.customer.label.attach-customer",
                    })}
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
                      onChange={(event) => setQuery(event.target.value)}
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
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-1/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredCustomers.length > 0 &&
                        filteredCustomers.map((customer) => (
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
                              formik.setFieldValue("customer", customer)
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
                                      active ? "text-white" : "text-klaq-600"
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
                      {query !== "" && filteredCustomers.length === 0 && (
                        <div className="px-4 py-14 text-center sm:px-14">
                          {/* //todo: intl */}
                          <UsersIcon
                            className="mx-auto h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                          <p className="mt-4 text-sm text-gray-900">
                            Aucun client n'a été trouvé avec ces termes de
                            recherches. Vous pouvez remplir manuellement les
                            champs ci-dessous
                          </p>
                        </div>
                      )}
                    </Combobox.Options>
                  )}
                </Combobox>
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
            </CardContainer>
            <CommentaryFeed isCommentingAllowed={true} />
          </div>
          {/* event */}
          <div className="w-2/3">
            <div className="flex flex-col space-y-4">
              <CardContainer>
                <div className="px-4 py-5 sm:p-6">
                  <TextField
                    placeholder="Titre de l'évènement ou laisser vide pour le générer automatiquement"
                    name="title"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                </div>
              </CardContainer>
              {formik.values.kEvents.map((kEvent, index) => (
                <CardContainer>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                      <div className="col-span-2">
                        <TextField
                          label="Type d'évènement"
                          placeholder="Mariage, anniversaire, etc."
                          name={`kEvents.${index}.title`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].title}
                        />
                      </div>
                      <div className="col-span-1">
                        {formik.values.kEvents.length !== 1 ? (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteElement(index)}
                            >
                              <XMarkIcon className="h-6 w-6 text-gray-500" />
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div className="col-span-full border-t border-gray-900/4 my-4"></div>
                      <div className="col-span-1">
                        <TextField
                          type="date"
                          label={intl.formatMessage({
                            id: "new-event.date.label.date",
                          })}
                          name={`kEvents.${index}.date`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].date}
                        />
                      </div>
                      <div className="col-span-1">
                        <TextField
                          type="time"
                          label={intl.formatMessage({
                            id: "new-event.date.label.start-time",
                          })}
                          name={`kEvents.${index}.startTime`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].startTime}
                        />
                      </div>
                      <div className="col-span-1">
                        <TextField
                          type="time"
                          label={intl.formatMessage({
                            id: "new-event.date.label.end-time",
                          })}
                          name={`kEvents.${index}.endTime`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].endTime}
                        />
                      </div>
                      {false && (
                        <div className="col-span-full">
                          <Alert
                            status="warning"
                            title="Un évènement existe déjà a cette date"
                            text={`"Mariage pour Thierry et Denise" avec le status "DEVIS ACCEPTE" existe à la date désiré`}
                          />
                        </div>
                      )}
                      <div className="col-span-1">
                        <TextField
                          label={intl.formatMessage({
                            id: "new-event.date.label.number-of-guest",
                          })}
                          type="number"
                          name={`kEvents.${index}.guests`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].guests}
                        />
                      </div>
                      <div className="col-span-1">
                        <SelectField
                          label={intl.formatMessage({
                            id: "new-event.date.label.public-event",
                          })}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].publicEvent}
                          name={`kEvents.${index}.publicEvent`}
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
                      <div className="col-span-full border-t border-gray-900/4 my-4"></div>
                      <div className="col-span-full">
                        <Label htmlFor="address">
                          {intl.formatMessage({
                            id: "edit-event.label.autocomplete",
                          })}
                        </Label>
                        <MapAutocompleteInput
                          defaultAddress={``}
                          setAddress={(address) =>
                            handleRetrieveAddress(address, index)
                          }
                        />
                      </div>
                      <div className="col-span-full">
                        <TextField
                          label={intl.formatMessage({
                            id: "new-event.location.label.address",
                          })}
                          placeholder={intl.formatMessage({
                            id: "new-event.location.input.address",
                          })}
                          name={`kEvents.${index}.address`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].address}
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
                          name={`kEvents.${index}.zipcode`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].zipcode}
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
                          name={`kEvents.${index}.city`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].city}
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
                          name={`kEvents.${index}.country`}
                          onChange={formik.handleChange}
                          value={formik.values.kEvents[index].country}
                        />
                      </div>
                    </div>
                  </div>
                </CardContainer>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  leadingIcon={<DocumentDuplicateIcon className="h-5 w-5" />}
                  variant="text"
                  color="primary"
                  onClick={handleDuplicateNewEvent}
                >
                  Dupliquer l'évènement
                </Button>
                <Button
                  type="button"
                  leadingIcon={<PlusIcon className="h-5 w-5" />}
                  variant="text"
                  color="primary"
                  onClick={handleLinkNewEvent}
                >
                  Lier un nouvel évènement
                </Button>
              </div>
              <CardContainer>
                <div className="px-4 py-5 sm:p-6">
                  <UploadDocumentZone fileList={fileList} setFiles={setFiles} />
                </div>
              </CardContainer>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={formik.handleSubmit}
                >
                  {intl.formatMessage({
                    id: "new-event.submit",
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </PageLayout>
  );
};
