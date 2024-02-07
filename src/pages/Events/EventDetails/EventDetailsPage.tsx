import { MainEvent } from "interface/Event/main-event.interface";
import { PageLayout } from "layouts";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFetchMainEvent } from "redux/MainEvent/hooks";
import { getMainEvent } from "redux/MainEvent/selectors";
import { EventDetailsBody } from "./EventDetailsBody";
import { EventDetailsHeader } from "./EventDetailsHeader";

export type MainEventDetailsPageProps = {
  event: MainEvent;
};

export const EventDetailsPage = () => {
  const { id } = useParams();
  const [{ isLoading }, fetchEvent] = useFetchMainEvent();
  const event = useSelector((state: any) => getMainEvent(state, id!));

  useEffect(() => {
    fetchEvent(id);
  }, []);

  return (
    <PageLayout>
      {isLoading && !event ? (
        <div>Loading...</div>
      ) : (
        event && (
          <div className="flex flex-col space-y-4 flex-grow h-full">
            <EventDetailsHeader event={event} />
            <EventDetailsBody event={event} />
          </div>
        )
      )}
    </PageLayout>
  );
};
