import {
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  HomeIcon,
  PencilSquareIcon,
  PlusIcon,
  PlusSmallIcon,
  UserCircleIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  CardContainer,
  CommentaryFeed,
  EventBadgeButton,
  KebabMenu,
  Label,
  MapAutocompleteInput,
  SelectField,
  TextField,
  UploadDocumentZone,
} from "components";
import {
  differenceInCalendarDays,
  differenceInMonths,
  format,
  isPast,
  isToday,
  isTomorrow,
} from "date-fns";
import { useFormik } from "formik";
import { RetrieveAddress } from "interface/retrieve-address.interface";
import { PageLayout } from "layouts";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFetchMainEvent, useUpdateMainEvent } from "redux/MainEvent/hooks";
import { getMainEvent } from "redux/MainEvent/selectors";
import { Quote, QuoteStatus } from "redux/Quote/slices";
import { PATHS } from "routes";
import { getSubtotalForQuote } from "utils/quote";
import { classNames, formatSiret, shortenString } from "utils/utils";
import { initialValues, validationSchema } from "./newEventForm";
import { Alert } from "components/Alert/Alert";
import { CustomerType } from "redux/Customer/slices";

export const MainEventDetails = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const [query, setQuery] = useSearchParams();

  const [editMainTitle, setEditMainTitle] = useState(false);
  const [editBudget, setEditBudget] = useState(false);
  const [fileList, setFiles] = useState<File[]>([]);

  const mainEvent = useSelector((state: any) => getMainEvent(state, id!));

  const [, fetchMainEvent] = useFetchMainEvent();
  const [{ isLoading: isUpdating }, updateEvent] = useUpdateMainEvent();

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...mainEvent,
    },
    validationSchema,
    onSubmit: async (values) => {
      await updateEvent(values);
      fetchMainEvent(id);
    },
    enableReinitialize: true,
  });

  const getRemainingTime = (date: Date | string) => {
    // todo: intl
    const today = new Date();

    date = new Date(date);
    const daysDifference = differenceInCalendarDays(today, date);
    const monthsDifference = differenceInMonths(today, date);

    if (isPast(date)) return `Il y a ${daysDifference} jours`;
    if (isToday(date)) return "Aujourd'hui";
    if (isTomorrow(date)) return "Demain";
    if (daysDifference <= 7) return `dans ${-daysDifference} jours`;
    if (monthsDifference <= 1) return `dans ${-monthsDifference} mois`;
    if (monthsDifference > 1) return `dans ${-monthsDifference} mois`;
    return format(date, "dd/MM/yyyy");
  };

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

  const isAmountAvailable = false;

  const getEventValue = (quotes_: Quote[] | undefined) => {
    if (!quotes_ || !quotes_.length) return "0.00";

    const acceptedQuotes = quotes_.filter(
      (quote) => quote.status === QuoteStatus.ACCEPTED
    );
    if (acceptedQuotes.length)
      return acceptedQuotes
        .map((quote) => getSubtotalForQuote(quote))
        .reduce((acc, curr) => acc + curr)
        .toFixed(2);

    const quotes = quotes_
      .filter((quote) => quote.status !== QuoteStatus.REJECTED)
      .map((quote) => getSubtotalForQuote(quote));
    return Math.min(...quotes).toFixed(2);
  };

  const tabs = [
    {
      name: "Roadmap",
      current: query.get("tab") === "Roadmap",
    },
    {
      name: "Map",
      current: query.get("tab") === "Map",
    },
    {
      name: "Documents",
      current: query.get("tab") === "Documents",
    },
    {
      name: "Client",
      current: query.get("tab") === "Client",
    },
    {
      name: "Logs",
      current: query.get("tab") === "Logs",
    },
  ];

  const handleCustomerDetails = () => {
    navigate(`${PATHS.CUSTOMERS}/${mainEvent.customer.id}`);
  };

  const handleGenerateQuote = () => {
    navigate(`${PATHS.QUOTE}/generate/${id}`);
  };

  const handleLinkNewEvent = () => {
    const lastElement = formik.values.subEvents.at(-1);
    formik.setValues({
      ...formik.values,
      subEvents: [
        ...formik.values.subEvents,
        lastElement
          ? {
              ...initialValues.subEvents[0],
              startTime: lastElement.endTime,
              //   address: lastElement.address,
              //   city: lastElement.city,
              //   zipcode: lastElement.zipcode,
              //   country: lastElement.country,
            }
          : initialValues.subEvents[0],
      ],
    });
  };

  const handleDeleteElement = (index: number) => {
    formik.setValues({
      ...formik.values,
      subEvents: formik.values.subEvents.filter((_, i) => i !== index),
    });
    updateEvent(formik.values);
  };

  const formatAddress = (
    address?: string,
    zip?: string,
    city?: string,
    country?: string
  ) => {
    if (!address || !zip || !city || !country)
      return intl.formatMessage({
        id: "customers.customer-details.no-address",
      });
    return intl.formatMessage(
      {
        id: "customers.customer-details.address",
      },
      {
        address,
        zip,
        city,
        country,
      }
    );
  };

  useEffect(() => {
    fetchMainEvent(id);
    setQuery({
      tab: tabs[0].name,
    });
  }, []);

  return (
    <PageLayout>
      {mainEvent ? (
        <>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="md:flex space-x-4">
                <div className="w-2/3">
                  <CardContainer>
                    <dl className="flex flex-wrap h-20">
                      <div className="flex-auto pl-6 pt-6">
                        <dt className="text-sm font-semibold leading-6 text-gray-900">
                          Récapitulatif
                        </dt>
                        <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                          {getRemainingTime(mainEvent.subEvents[0].date)}
                        </dd>
                      </div>
                      <div className="flex-none self-end px-6 pt-4">
                        <dt className="sr-only">Status</dt>
                        <dd>
                          {mainEvent && mainEvent.status && mainEvent.id && (
                            <EventBadgeButton
                              status={mainEvent.status}
                              eventId={mainEvent.id}
                            />
                          )}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4 px-4 py-5 sm:p-6 border-t border-gray-900/4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <div className="flex flex-row items-center space-x-4">
                            <span>
                              <CalendarDaysIcon
                                className="h-5 w-5  text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="text-sm font-medium leading-6 text-gray-900">
                              {new Date(
                                mainEvent.subEvents[0].date
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                mainEvent.subEvents[
                                  mainEvent.subEvents.length - 1
                                ].date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          {editMainTitle ? (
                            <div className="relative">
                              <TextField
                                placeholder="Titre de l'évènement ou laisser vide pour le générer automatiquement"
                                name="title"
                                onChange={formik.handleChange}
                                value={formik.values.title}
                              />
                              <button className="absolute inset-y-0 pl-3 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <CheckIcon
                                  className="h-5 w-5 text-success-500"
                                  aria-hidden="true"
                                  onClick={() => setEditMainTitle(false)}
                                />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-row items-center space-x-4">
                              <span className="text-sm font-medium leading-6 text-gray-500">
                                Type :{" "}
                              </span>
                              <span
                                className="text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer"
                                onDoubleClick={() => setEditMainTitle(true)}
                              >
                                {shortenString(30, mainEvent.title)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="col-span-1">
                          <div className="flex flex-row items-center space-x-4">
                            <span>
                              <ClockIcon
                                className="h-5 w-5  text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="text-sm font-medium leading-6 text-gray-900">
                              {mainEvent.subEvents[0].startTime
                                ? mainEvent.subEvents[0].startTime
                                : "Aucune heure de début renseignée"}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="flex flex-row items-center space-x-4">
                            <span className="text-sm font-medium leading-6 text-gray-500">
                              Évènement public :{" "}
                            </span>
                            <span className="text-sm font-medium leading-6 text-gray-900">
                              {mainEvent.subEvents[0].publicEvent
                                ? "Oui"
                                : "Non"}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1 flex flex-col">
                          <div className="flex flex-row items-center space-x-4">
                            <span>
                              <UserCircleIcon
                                className="h-5 w-5  text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="text-sm font-medium leading-6 text-gray-900">
                              <a
                                href={`${PATHS.CUSTOMERS}/${mainEvent.customer.id}`}
                              >
                                {mainEvent.customer.name}
                              </a>
                            </span>
                          </div>
                          <div className="flex flex-row items-center space-x-4">
                            <span className="w-5 h-5"></span>
                            <span className="text-sm font-medium leading-6 text-gray-500">
                              <a href={`tel:${mainEvent.customer.phone}`}>
                                {mainEvent.customer.phone}
                              </a>
                            </span>
                          </div>
                          <div className="flex flex-row items-center space-x-4">
                            <span className="w-5 h-5"></span>
                            <span className="text-sm font-medium leading-6 text-gray-500">
                              <a href={`mailto:${mainEvent.customer.email}`}>
                                {mainEvent.customer.email}
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="flex flex-row items-center space-x-4">
                            <span className="text-sm font-medium leading-6 text-gray-500">
                              Personnes présentes :{" "}
                            </span>
                            <span className="text-sm font-medium leading-6 text-gray-900">
                              {mainEvent.subEvents[0].guests
                                ? mainEvent.subEvents[0].guests
                                : "Non renseigné"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContainer>
                </div>
                <div className="w-1/3">
                  <CardContainer>
                    <dl className="flex flex-wrap h-20">
                      <div className="flex-auto pl-6 pt-6">
                        <dt className="text-sm font-semibold leading-6 text-gray-900">
                          Finance
                        </dt>
                        <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
                      </div>
                      <div className="flex-none self-end px-6 pt-4">
                        <dt className="sr-only">Finance</dt>
                        <dd className="sr-only">Finance</dd>
                      </div>
                    </dl>
                    <div className="mt-4 px-4 py-5 sm:p-6 border-t border-gray-900/4 flex flex-col space-y-4">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-row items-center space-x-4">
                          {editBudget ? (
                            <div className="relative">
                              <TextField
                                placeholder="Titre de l'évènement ou laisser vide pour le générer automatiquement"
                                name="budget"
                                onChange={formik.handleChange}
                                value={formik.values.budget}
                              />
                              <button className="absolute inset-y-0 pl-3 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <CheckIcon
                                  className="h-5 w-5 text-success-500"
                                  aria-hidden="true"
                                  onClick={() => setEditBudget(false)}
                                />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm font-medium leading-6 text-gray-500">
                                Budget :{" "}
                              </span>
                              <span
                                className="text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer"
                                onDoubleClick={() => setEditBudget(true)}
                              >
                                {mainEvent.budget
                                  ? `${mainEvent.budget
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`
                                  : "Non renseigné"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-row items-center space-x-4">
                          <span className="text-sm font-medium leading-6 text-gray-500">
                            Devis :{" "}
                          </span>
                          <span className="text-sm font-medium leading-6 text-gray-900">
                            {mainEvent.quotes && mainEvent.quotes.length > 0 ? (
                              `${getEventValue(mainEvent.quotes)} €`
                            ) : (
                              <Button
                                variant="link"
                                color="primary"
                                type="button"
                                onClick={handleGenerateQuote}
                                leadingIcon={
                                  <PlusSmallIcon className="h-5 w-5" />
                                }
                              >
                                Ajouter un devis
                              </Button>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-row items-center space-x-4">
                          <span className="text-sm font-medium leading-6 text-gray-500">
                            Facturé :{" "}
                          </span>
                          <span className="text-sm font-medium leading-6 text-gray-900">
                            {mainEvent.quotes && mainEvent.quotes.length > 0 ? (
                              `${getEventValue(mainEvent.quotes)} €`
                            ) : (
                              <Button
                                variant="link"
                                color="primary"
                                type="button"
                                disabled
                                leadingIcon={
                                  <PlusSmallIcon className="h-5 w-5" />
                                }
                              >
                                Ajouter une facture
                              </Button>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContainer>
                </div>
              </div>

              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                  <span
                    className={classNames(
                      tab.current
                        ? "bg-klaq-100 text-klaq-700"
                        : "text-gray-500 hover:text-gray-700",
                      "rounded-md px-3 py-2 text-sm font-medium hover:cursor-pointer"
                    )}
                    onClick={() =>
                      setQuery({
                        tab: tab.name,
                      })
                    }
                  >
                    {tab.name}
                  </span>
                ))}
              </nav>
              {tabs[0].current && (
                <div className="text-center">
                  {formik.values.subEvents &&
                    formik.values.subEvents.length > 0 &&
                    mainEvent.subEvents &&
                    formik.values.subEvents.map((subEvents, index) => (
                      <>
                        <CardContainer>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="text-left grid grid-cols-3 gap-4">
                              {formik.errors.subEvents &&
                                formik.errors.subEvents[index] &&
                                formik.touched.subEvents &&
                                formik.touched.subEvents[index] && (
                                  <div className="col-span-full">
                                    <Alert status="danger" title="Erreur">
                                      Les champs "type d'évènement", "date" et
                                      "adresse" sont obligatoires pour créer un
                                      évènement
                                    </Alert>
                                  </div>
                                )}
                              <div className="col-span-1">
                                <TextField
                                  type="date"
                                  label={intl.formatMessage({
                                    id: "new-event.date.label.date",
                                  })}
                                  name={`subEvents.${index}.date`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.subEvents[index].date
                                      ? format(
                                          new Date(
                                            formik.values.subEvents[index].date
                                          ),
                                          "yyyy-MM-dd"
                                        )
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-span-2">
                                <TextField
                                  label="Type d'évènement*"
                                  placeholder="Mariage, anniversaire, etc."
                                  name={`subEvents.${index}.type`}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[index].type}
                                />
                              </div>
                              <div className="col-span-1">
                                <TextField
                                  type="time"
                                  label={intl.formatMessage({
                                    id: "new-event.date.label.arrival-time",
                                  })}
                                  name={`subEvents.${index}.arrivalTime`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.subEvents[index].arrivalTime
                                  }
                                />
                              </div>
                              <div className="col-span-1">
                                <TextField
                                  type="time"
                                  label={intl.formatMessage({
                                    id: "new-event.date.label.start-time",
                                  })}
                                  name={`subEvents.${index}.startTime`}
                                  onChange={formik.handleChange}
                                  value={
                                    formik.values.subEvents[index].startTime
                                  }
                                />
                              </div>
                              <div className="col-span-1">
                                <TextField
                                  type="time"
                                  label={intl.formatMessage({
                                    id: "new-event.date.label.end-time",
                                  })}
                                  name={`subEvents.${index}.endTime`}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[index].endTime}
                                />
                              </div>
                              <div className="col-span-full border-t border-gray-900/4 my-4"></div>
                              <div className="col-span-1">
                                <SelectField
                                  label={intl.formatMessage({
                                    id: "new-event.date.label.public-event",
                                  })}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[
                                    index
                                  ].publicEvent.toString()}
                                  name={`subEvents.${index}.publicEvent`}
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
                              <div className="col-span-1">
                                <TextField
                                  label={intl.formatMessage({
                                    id: "new-event.date.label.number-of-guest",
                                  })}
                                  min={0}
                                  type="number"
                                  name={`subEvents.${index}.guests`}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[index].guests}
                                />
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
                                  name={`subEvents.${index}.address`}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[index].address}
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
                                  name={`subEvents.${index}.zipcode`}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[index].zipcode}
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
                                  name={`subEvents.${index}.city`}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[index].city}
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
                                  name={`subEvents.${index}.country`}
                                  onChange={formik.handleChange}
                                  value={formik.values.subEvents[index].country}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            {formik.values.subEvents &&
                              formik.values.subEvents.length !== 1 && (
                                <Button
                                  type="button"
                                  variant="text"
                                  color="secondary"
                                  onClick={() => handleDeleteElement(index)}
                                >
                                  Supprimer
                                </Button>
                              )}
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              size="lg"
                              isLoading={isUpdating}
                            >
                              {intl.formatMessage({
                                id: "settings.button.submit",
                              })}
                            </Button>
                          </div>
                        </CardContainer>
                        <div className="flex items-center">
                          <div className="flex-1 pr-4"></div>
                          <div className="border-l border-2 border-gray-900/3 h-16"></div>
                          <div className="flex-1 pl-4"></div>
                        </div>
                      </>
                    ))}
                  <div className="relative flex justify-center">
                    <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        className="relative bg-klaq-500 text-white rounded-full p-3 hover:bg-klaq-700 focus:outline-none"
                        onClick={handleLinkNewEvent}
                      >
                        <PlusIcon className="w-5 h-5 text-white" />
                      </button>
                    </span>
                  </div>
                </div>
              )}
              {tabs[1].current && (
                <CardContainer>
                  <div className="px-4 py-5 sm:p-6"></div>
                </CardContainer>
              )}
              {tabs[2].current && (
                <CardContainer>
                  <div className="px-4 py-5 sm:p-6">
                    <UploadDocumentZone
                      fileList={fileList}
                      setFiles={setFiles}
                    />
                  </div>
                </CardContainer>
              )}
              {tabs[3].current && (
                <CardContainer>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-row">
                      <div className="flex flex-col space-y-4">
                        <span className="border border-gray-200 rounded-md px-3.5 py-2.5 font-semibold text-gray-600 bg-gray-200">
                          {mainEvent.customer.name?.at(0)}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2 ml-10">
                        <h2 className="text-2xl leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                          {mainEvent.customer.name}
                        </h2>
                        {mainEvent.customer &&
                        mainEvent.customer.type === CustomerType.COMPANY ? (
                          <>
                            <p className="text-sm text-gray-500">
                              {intl.formatMessage(
                                {
                                  id: "customers.customer-details.siret",
                                },
                                {
                                  siret: formatSiret(
                                    mainEvent.customer.legalRegistrationNumber
                                  ),
                                }
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {intl.formatMessage(
                                {
                                  id: mainEvent.customer.legalVATNumber
                                    ? "customers.customer-details.vat-number"
                                    : "customers.customer-details.no-vat-number",
                                },
                                {
                                  vatNumber: mainEvent.customer.legalVATNumber,
                                }
                              )}
                            </p>
                          </>
                        ) : null}
                        {mainEvent.customer.createdAt ? (
                          <div className="flex flex-row space-x-2 items-center">
                            <UserPlusIcon className="h-5 w-5 inline-block mr-2" />
                            <p className="text-sm text-gray-900">
                              {intl.formatMessage(
                                {
                                  id: "customers.customer-details.first-interact",
                                },
                                {
                                  date: new Date(
                                    mainEvent.customer.createdAt
                                  ).toLocaleDateString(),
                                }
                              )}
                            </p>
                          </div>
                        ) : null}

                        <div className="flex flex-row space-x-2 items-center">
                          <HomeIcon className="h-5 w-5 inline-block mr-2" />
                          <p className="text-sm text-gray-900">
                            {formatAddress(
                              mainEvent.customer.address,
                              mainEvent.customer.zipcode,
                              mainEvent.customer.city,
                              mainEvent.customer.country
                            )}
                          </p>
                        </div>
                        <div className="flex flex-row space-x-2 items-center">
                          <UserIcon className="h-5 w-5 inline-block mr-2" />
                          <p className="text-sm text-gray-900">
                            {mainEvent.customer.firstName}{" "}
                            {mainEvent.customer.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col ml-auto">
                        <Button
                          variant="contained"
                          color="primary"
                          type="button"
                          onClick={handleCustomerDetails}
                        >
                          Voir/Editer le profil du client
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContainer>
              )}
              {tabs[4].current && (
                <CardContainer>
                  <div className="px-4 py-5 sm:p-6">
                    <CommentaryFeed />
                  </div>
                </CardContainer>
              )}
            </div>
          </form>
        </>
      ) : null}
    </PageLayout>
  );
};
