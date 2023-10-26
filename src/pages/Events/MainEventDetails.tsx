import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CardContainer,
  CommentaryFeed,
  EventBadgeButton,
  TextField,
} from "components";
import { useFormik } from "formik";
import { PageLayout } from "layouts";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFetchMainEvent } from "redux/MainEvent/hooks";
import { getMainEvent } from "redux/MainEvent/selectors";
import { PATHS } from "routes";
import { initialValues, validationSchema } from "./newEventForm";
import {
  differenceInCalendarDays,
  differenceInMonths,
  format,
  isPast,
  isToday,
  isTomorrow,
} from "date-fns";

export const MainEventDetails = () => {
  const intl = useIntl();
  const { id } = useParams();

  const [editMainTitle, setEditMainTitle] = useState(false);

  const mainEvent = useSelector((state: any) => getMainEvent(state, id!));

  const [, fetchMainEvent] = useFetchMainEvent();

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...mainEvent,
    },
    validationSchema,
    onSubmit: async (values) => {
      // todo: add file to event
    },
    enableReinitialize: true,
  });

  const getRemainingTime = (date: Date | string) => {
    // todo: intl
    const today = new Date();

    date = new Date(date);
    const daysDifference = differenceInCalendarDays(today, date);
    const monthsDifference = differenceInMonths(today, date);

    if (isPast(date)) return "Passé";
    if (isToday(date)) return "Aujourd'hui";
    if (isTomorrow(date)) return "Demain";
    if (daysDifference <= 7) return `dans ${daysDifference} jours`;
    if (monthsDifference <= 1) return `dans ${monthsDifference} mois`;
    if (monthsDifference > 1) return `dans ${monthsDifference} mois`;
    return format(date, "dd/MM/yyyy");
  };

  useEffect(() => {
    fetchMainEvent(id);
  }, []);

  return (
    <PageLayout>
      {mainEvent ? (
        <>
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <CardContainer>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    {editMainTitle ? (
                      <>
                        <div className="w-4/5">
                          <TextField
                            placeholder="Titre de l'évènement ou laisser vide pour le générer automatiquement"
                            name="title"
                            onChange={formik.handleChange}
                            value={formik.values.title}
                          />
                        </div>

                        <button onClick={() => setEditMainTitle(false)}>
                          <CheckIcon
                            className="h-6 w-6 text-success-500"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          onClick={() =>
                            formik.setFieldValue("title", mainEvent.title)
                          }
                        >
                          <ArrowPathIcon
                            className="h-6 w-6 text-gray-500"
                            aria-hidden="true"
                          />
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className="w-full hover:cursor-pointer"
                          onDoubleClick={() => setEditMainTitle(true)}
                        >
                          <h2 className="text-lg font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                            {formik.values.title}
                          </h2>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContainer>
            </div>
          </div>
          <div className="mt-8"></div>
          <div className="flex flex-row space-x-8">
            <div className="flex flex-col w-1/3 space-y-8">
              <CardContainer>
                <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                    <dt className="text-sm font-semibold leading-6 text-gray-900">
                      Summary
                    </dt>
                    <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                      Lorem ipsum
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
                <div className="mt-4 px-4 py-5 sm:p-6 border-t border-gray-900/5">
                  <div className="flex flex-col space-y-4 w-full">
                    <div className="flex flex-row items-center space-x-4">
                      <span>
                        <UserCircleIcon
                          className="h-8 w-8 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-sm font-medium leading-6 text-gray-900">
                        <a href={`${PATHS.CUSTOMERS}/${mainEvent.customer.id}`}>
                          {mainEvent.customer.name}
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <span className="w-8 h-8"></span>
                      <span className="text-sm font-medium leading-6 text-gray-500">
                        <a href={`mailto:${mainEvent.customer.email}`}>
                          {mainEvent.customer.email}
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <span className="w-8 h-8"></span>
                      <span className="text-sm font-medium leading-6 text-gray-500">
                        <a href={`tel:${mainEvent.customer.phone}`}>
                          {mainEvent.customer.phone}
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <span>
                        <CalendarDaysIcon className="h-8 w-8 text-gray-400" />
                      </span>
                      <span className="text-sm font-medium leading-6 text-gray-500">
                        {getRemainingTime(mainEvent.subEvents[0].date)}
                      </span>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <span>
                        <CreditCardIcon className="h-8 w-8 text-gray-400" />
                      </span>
                      <span className="text-sm font-medium leading-6 text-gray-500">
                        {0.0} €
                      </span>
                    </div>
                  </div>
                </div>
              </CardContainer>
              <div>
                <CommentaryFeed />
              </div>
            </div>
            <div className="flex flex-col w-2/3">
              <CardContainer>
                <div className="px-4 py-5 sm:p-6"></div>
              </CardContainer>
            </div>
          </div>
        </>
      ) : null}
    </PageLayout>
  );
};
