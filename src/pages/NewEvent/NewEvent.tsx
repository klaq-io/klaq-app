import { useFormik } from "formik";
import { Calendar } from "../../components";
import { PageLayout } from "../../layouts";

export const NewEvent = () => {
  const formik = useFormik({
    initialValues: {
      date: "",
      time: "",
      duration: "",
      eventType: "",
      numberOfGuests: "",
      publicEvent: false,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
  });
  return (
    <PageLayout>
      <div className="flex flex-row">
        <form
          className="w-1/2 flex flex-col p-4"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-lg font-bold text-primary">Date</h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">When?</span>
              </label>
              <input
                name="date"
                type="date"
                placeholder="When?"
                className="input input-bordered"
                onChange={formik.handleChange}
                value={formik.values.date}
              />
            </div>
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Time?</span>
              </label>
              <input
                name="time"
                type="time"
                placeholder="When?"
                className="input input-bordered"
                onChange={formik.handleChange}
                value={formik.values.time}
              />
            </div>
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Duration?</span>
              </label>
              <input
                name="duration"
                type="number"
                placeholder="Duration (in hour)?"
                className="input input-bordered hour-suffix"
                onChange={formik.handleChange}
                value={formik.values.duration}
              />
            </div>
          </div>
          <div className="flex flex-row mt-4">
            This event will take place on X, from X until X.
          </div>
          <div className="flex flex-row justify-between mt-2">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Event Type?</span>
              </label>
              <select
                name="eventType"
                className="select select-bordered"
                onChange={formik.handleChange}
                value={formik.values.eventType}
              >
                <option disabled selected>
                  Select an option
                </option>
                <option>Han Solo</option>
                <option>Greedo</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Number of guests</span>
              </label>
              <input
                type="number"
                min={0}
                step={10}
                name="numberOfGuests"
                placeholder="Number of guests"
                className="input input-bordered"
                onChange={formik.handleChange}
                value={formik.values.numberOfGuests}
              />
            </div>
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Public Event </span>
              </label>
              <input
                type="checkbox"
                className="toggle toggle-lg"
                name="publicEvent"
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <h1 className="text-lg font-bold text-primary mt-4">Location</h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Location?</span>
              </label>
              <input
                name="date"
                type="date"
                placeholder="When?"
                className="input input-bordered"
                onChange={formik.handleChange}
                value={formik.values.date}
              />
            </div>
          </div>
          <button className="btn btn-primary mt-4">Create Event</button>
        </form>
        <div className="w-1/2 border-debug p-4">hello2</div>
      </div>
    </PageLayout>
  );
};

export default NewEvent;
