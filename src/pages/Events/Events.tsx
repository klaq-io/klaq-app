import { useSelector } from "react-redux";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getAllEvents } from "../../redux/Events/selectors";
import { useEffect } from "react";
import { Event } from "../../redux/Events/slices";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";

export const Events = () => {
  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const events: Event[] = useSelector(getAllEvents);
  const navigate = useNavigate();

  const handleEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}`);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      <div>Events</div>
      {events
        ? events.map((event) => (
            <div
              className="cursor-pointer"
              key={event.id}
              onClick={() => handleEventDetails(event.id)}
            >
              {event.id}
            </div>
          ))
        : null}
    </PageLayout>
  );
};

export default Events;
