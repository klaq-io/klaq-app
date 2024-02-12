import {
  PencilSquareIcon,
  PlusSmallIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  ClockIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  CardContainer,
  EventBadgeButton,
  KebabMenu,
  EventMapV2,
  EditEventModal,
} from "components";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { CustomerType } from "redux/Customer/slices";
import { PATHS } from "routes";
import { formatAddress } from "utils/address";
import { formatPhoneNumber } from "utils/customer";
import { getRemainingTime } from "utils/time";
import { getDayStr, getMonthStr } from "utils/utils";
import { MainEventDetailsPageProps } from "./EventDetailsPage";
import { useState } from "react";

export const EventDetailsHeader = (props: MainEventDetailsPageProps) => {
  const { event } = props;
  const intl = useIntl();
  const navigate = useNavigate();
  const [openEditor, setOpenEditor] = useState(false);

  const eventDate = new Date(event.subEvents[0].date);
  const menu = [
    {
      name: intl.formatMessage({ id: "Editer" }),
      icon: PencilSquareIcon,
      onClick: () => navigate(`${PATHS.EVENTS}/${event.id}/edit`),
    },
    {
      name: intl.formatMessage({ id: "Ajouter une facture" }),
      icon: PlusSmallIcon,
      onClick: () => navigate(`${PATHS.EVENTS}/${event.id}/edit`),
    },
    {
      name: intl.formatMessage({ id: "Ajouter un devis" }),
      icon: PlusSmallIcon,
      onClick: () => navigate(`${PATHS.EVENTS}/${event.id}/edit`),
    },
    {
      name: intl.formatMessage({ id: "Dupliquer" }),
      icon: ArrowTopRightOnSquareIcon,
      onClick: () => navigate(`${PATHS.EVENTS}/${event.id}/duplicate`),
    },
    {
      name: intl.formatMessage({ id: "Supprimer" }),
      icon: TrashIcon,
      onClick: () => navigate(`${PATHS.EVENTS}/${event.id}/delete`),
    },
  ];

  return (
    <>
      <div className="flex flex-col space-y-4">
        <CardContainer className="p-4 w-full flex flex-row items-center justify-between">
          <div className="flex flex-row space-x-4 items-center">
            <div className="border-gray-200 border-r pr-8 text-klaq-600 flex flex-row space-x-2 items-center">
              <span className="text-md">
                {intl.formatMessage({
                  id: getDayStr(eventDate),
                })}
              </span>
              <span className="text-xl font-bold">
                {format(eventDate, "dd")}
              </span>
              <span className="text-md">
                {intl.formatMessage({
                  id: getMonthStr(new Date(eventDate)),
                })}
              </span>
              <span className="text-md">{format(eventDate, "yyyy")}</span>
            </div>
            <EventBadgeButton status={event.status} eventId={event.id} />
          </div>
          <span className="flex flex-row space-x-4 items-center">
            <span className="text-gray-900 font-semibold">
              {getRemainingTime(eventDate)}
            </span>
            <KebabMenu items={menu} buttonSize="lg" />
          </span>
        </CardContainer>
        <div className="flex flex-row space-x-4">
          <CardContainer className="px-4 py-5 sm:p-6 w-1/2 flex flex-col space-y-4">
            <span className="flex flex-row items-center justify-between">
              <span className="text-gray-900 font-semibold">{event.title}</span>
              <button onClick={() => setOpenEditor(true)}>
                <PencilSquareIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </span>
            <div className="border-t border-gray-900/4"></div>
            <div className="flex flex-col space-y-4">
              <span className="flex flex-row space-x-4 items-center">
                <ClockIcon className="h-5 w-5  text-gray-400" />
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  {event.subEvents[0].startTime
                    ? event.subEvents[0].startTime
                    : "Aucune heure de début renseignée"}{" "}
                  -{" "}
                  {event.subEvents[0].endTime
                    ? event.subEvents[0].endTime
                    : "Aucune heure de fin renseignée"}
                </span>
              </span>

              <span className="flex flex-row space-x-4 items-center">
                {event.customer?.type === CustomerType.PRIVATE ? (
                  <UserCircleIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <BuildingLibraryIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
                <span className="text-sm font-semibold leading-6 text-gray-900 flex flex-row space-x-2 items-center hover:text-gray-600">
                  <button
                    onClick={() =>
                      navigate(`${PATHS.CUSTOMERS}/${event.customer.id}`)
                    }
                  >
                    <span>{event.customer.name} </span>
                  </button>
                  <span className="text-sm font-semibold  leading-6 text-gray-400">
                    <a href={`tel:${event.customer.phone}`}>
                      {formatPhoneNumber(event.customer.phone)}
                    </a>
                  </span>
                </span>
              </span>

              <span className="flex flex-row space-x-4 items-center">
                <MapPinIcon className="h-5 w-5  text-gray-400" />
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  {formatAddress({
                    address: event.subEvents[0].address,
                    zip: event.subEvents[0].zipcode,
                    city: event.subEvents[0].city,
                    country: event.subEvents[0].country,
                  })}
                </span>
              </span>
              <span className="flex flex-row space-x-4 items-center">
                <UserGroupIcon className="h-5 w-5  text-gray-400" />
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  {event.subEvents[0].guests} personnes attendues (évènement
                  public: {event.subEvents[0].publicEvent ? "oui" : "non"})
                </span>
              </span>
            </div>
          </CardContainer>
          <CardContainer className="px-4 py-5 sm:p-4 min-h-full w-1/2 flex flex-col space-y-4 flex-grow">
            <EventMapV2 eventId={event.id} />
          </CardContainer>
        </div>
      </div>
      <EditEventModal open={openEditor} setOpen={setOpenEditor} event={event} />
    </>
  );
};
