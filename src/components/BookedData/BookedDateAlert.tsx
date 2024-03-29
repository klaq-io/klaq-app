import { Alert } from 'components/Alert';
import { MiniCalendarPopUp } from 'components/MiniCalendar';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { MainEvent } from 'interface/Event/main-event.interface';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EventStatus } from 'redux/Events/slices';
import { useFetchMainEvents } from 'redux/MainEvent/hooks';
import {
  getEventAfterEvent,
  getEventBeforeEvent,
} from 'redux/MainEvent/selectors';
import { PATHS } from 'routes';
import { concatDateAndTime } from 'utils/concatDateAndTime';
import { classNames } from 'utils/utils';

type BookedDateAlertProps = {
  event: MainEvent;
};

export const BookedDateAlert = (props: BookedDateAlertProps) => {
  const intl = useIntl();
  const { event } = props;
  const navigate = useNavigate();
  const [shouldOpenMiniCalendarPopUp, setShouldOpenMiniCalendarPopUp] =
    useState(false);

  const [, fetchEvents] = useFetchMainEvents();

  const eventBefore = useSelector((state: any) =>
    getEventBeforeEvent(state, event.id),
  );
  const eventAfter = useSelector((state: any) =>
    getEventAfterEvent(state, event.id),
  );

  const getSameDayEvent = () => {
    const eventDate = new Date(event.subEvents[0].date);
    const eventBeforeDate =
      eventBefore && new Date(eventBefore.subEvents[0].date);
    const eventAfterDate = eventAfter && new Date(eventAfter.subEvents[0].date);

    if (
      eventAfterDate &&
      isSameDay(eventDate, eventAfterDate) &&
      eventAfter.status !== EventStatus.LOST
    ) {
      return eventAfter;
    }

    if (
      eventBeforeDate &&
      isSameDay(eventDate, eventBeforeDate) &&
      eventBefore.status !== EventStatus.LOST
    ) {
      return eventBefore;
    }

    return event;
  };

  const hasEventSameDay = getSameDayEvent().id !== event.id;
  const isEventSameDayAndBefore =
    hasEventSameDay && getSameDayEvent().id === eventBefore?.id;

  const isEventOverlapping = (
    event: MainEvent,
    eventToCompare: MainEvent,
    isEventBefore: boolean,
  ) => {
    if (
      isEventBefore &&
      event.subEvents[0].startTime &&
      eventToCompare.subEvents[0].endTime
    ) {
      const eventDate = concatDateAndTime(
        new Date(event.subEvents[0].date),
        event.subEvents[0].startTime,
      );

      const eventToCompareDate = concatDateAndTime(
        new Date(eventToCompare.subEvents[0].date),
        eventToCompare.subEvents[0].endTime,
      );
      return isBefore(eventDate, eventToCompareDate);
    } else if (
      !isEventBefore &&
      event.subEvents[0].endTime &&
      eventToCompare.subEvents[0].startTime
    ) {
      const eventDate = concatDateAndTime(
        new Date(event.subEvents[0].date),
        event.subEvents[0].endTime,
      );
      const eventToCompareDate = concatDateAndTime(
        new Date(eventToCompare.subEvents[0].date),
        eventToCompare.subEvents[0].startTime,
      );
      return isAfter(eventDate, eventToCompareDate);
    }
  };

  const handleGoToEvent = () => {
    const event = getSameDayEvent();
    if (event) {
      navigate(`${PATHS.EVENTS}/${event.id}/details`);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  return hasEventSameDay ? (
    isEventOverlapping(event, getSameDayEvent(), isEventSameDayAndBefore) ? (
      <>
        <Alert
          status="danger"
          title={intl.formatMessage({
            id: 'event-details.assistant.overlap.infobox.title',
          })}
        >
          {intl.formatMessage(
            {
              id: 'event-details.assistant.overlap.infobox.content',
            },
            {
              eventTitle: getSameDayEvent().title,
              time: isEventSameDayAndBefore
                ? getSameDayEvent().subEvents[0].endTime
                : getSameDayEvent().subEvents[0].startTime,
              a: (chunk: any) => (
                <button
                  className={classNames(
                    'text-danger-800',
                    'hover:underline',
                    'cursor-pointer',
                    'focus:outline-none',
                    'font-semibold text-sm',
                  )}
                  onClick={handleGoToEvent}
                >
                  {chunk}
                </button>
              ),
            },
          )}
        </Alert>
      </>
    ) : (
      <Alert
        status="warning"
        title={intl.formatMessage({
          id: 'event-details.assistant.booked.infobox.title',
        })}
      >
        {intl.formatMessage(
          {
            id: 'event-details.assistant.booked.infobox.content',
          },
          {
            eventTitle: getSameDayEvent().title,
            a: (chunk: any) => (
              <button
                className={classNames(
                  'text-yellow-800',
                  'hover:underline',
                  'cursor-pointer',
                  'focus:outline-none',
                  'font-semibold text-sm',
                )}
                onClick={handleGoToEvent}
              >
                {chunk}
              </button>
            ),
          },
        )}
      </Alert>
    )
  ) : (
    <>
      <Alert
        status="success"
        title={intl.formatMessage({
          id: 'event-details.assistant.no-booking.infobox.title',
        })}
      >
        {intl.formatMessage(
          {
            id: 'event-details.assistant.no-booking.infobox.content',
          },
          {
            a: (chunk: any) => (
              <button
                onClick={() => setShouldOpenMiniCalendarPopUp(true)}
                className="font-semibold"
              >
                {chunk.join()}
              </button>
            ),
          },
        )}
      </Alert>
      <MiniCalendarPopUp
        shouldBeOpened={shouldOpenMiniCalendarPopUp}
        setOpen={setShouldOpenMiniCalendarPopUp}
        startDate={new Date(event.subEvents[0].date)}
      />
    </>
  );
};
