import { useSelector } from "react-redux";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getAllEvents } from "../../redux/Events/selectors";
import { useEffect } from "react";
import { Event } from "../../redux/Events/slices";

export const Events = () => {
  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const events: Event[] = useSelector(getAllEvents);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <PageLayout>
      <div>Events</div>
      {isLoading ? <div>Loading...</div> : null}
      {events
        ? events.map((event) => <div key={event.id}>{event.id}</div>)
        : null}
    </PageLayout>
  );
};

export default Events;
