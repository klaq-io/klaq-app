import { Transition } from '@headlessui/react';
import { MainEvent } from 'interface/Event/main-event.interface';
import { PageLayout } from 'layouts';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFetchMainEvents } from 'redux/MainEvent/hooks';
import { getMainEvent } from 'redux/MainEvent/selectors';
import { EventDetailsBody } from './EventDetailsBody';
import { EventDetailsHeader } from './EventDetailsHeader';

export type MainEventDetailsPageProps = {
  event: MainEvent;
};

export const EventDetailsPage = () => {
  const { id } = useParams();
  const [{ isLoading }, fetchEvents] = useFetchMainEvents();
  const event = useSelector((state: any) => getMainEvent(state, id));

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <PageLayout isLoading={isLoading && !event}>
      {isLoading && !event ? (
        <></>
      ) : (
        event && (
          <Transition
            show={event.id !== undefined}
            enter="transition ease duration-500 transform"
            enterFrom="opacity-0 translate-y-12"
            enterTo="opacity-100 translate-y-0"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="flex flex-col space-y-4 flex-grow h-full">
              <EventDetailsHeader event={event} />
              <EventDetailsBody event={event} />
            </div>
          </Transition>
        )
      )}
    </PageLayout>
  );
};
