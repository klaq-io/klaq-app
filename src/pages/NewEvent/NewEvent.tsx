import { useFormik } from "formik";
import { Calendar } from "../../components";
import { PageLayout } from "../../layouts";
import { format, parse } from "date-fns";
import { useIntl } from "react-intl";
import { initialValues, validationSchema } from "./form";
import PhoneInput from "react-phone-input-2";
import { EventType } from "../../interface/event.interface";

export const NewEvent = () => {
  const intl = useIntl();

  const setPhoneNumber = (phone: string) => {
    formik.setValues({
      ...formik.values,
      customer: { ...formik.values.customer, phoneNumber: phone },
    });
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
  });

  return (
    <PageLayout>
      <div className="flex flex-row">
        <form
          className="w-1/2 flex flex-col p-4 "
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-lg font-bold text-primary">
            {intl.formatMessage({ id: "new-event.form.header.date" })}
          </h1>
          <div className="flex flex-row justify-start space-x-4">
            <div className="flex flex-col w-1/3">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({ id: "new-event.form.label.date" })}
                </span>
              </label>
              <input
                name="date"
                type="date"
                placeholder="When"
                className="input input-bordered"
                onChange={formik.handleChange}
                value={formik.values.date}
              />
            </div>
            <div className="flex flex-col w-1/3">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({ id: "new-event.form.label.time" })}
                </span>
              </label>
              <input
                name="time"
                type="time"
                step={900}
                placeholder="Time"
                className="input input-bordered"
                onChange={formik.handleChange}
                value={formik.values.time}
              />
            </div>
            <div className="flex flex-col w-1/3">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({ id: "new-event.form.label.duration" })}
                </span>
              </label>
              <input
                name="duration"
                type="number"
                min={0}
                placeholder="Duration (in hour)"
                className="input input-bordered hour-suffix"
                onChange={formik.handleChange}
                value={formik.values.duration}
              />
            </div>
          </div>
          <div className="flex flex-row justify-start space-x-4">
            <div className="flex flex-col w-1/3">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.event-type",
                  })}
                </span>
              </label>
              <select
                name="eventType"
                className="select select-bordered"
                onChange={formik.handleChange}
                value={formik.values.eventType}
              >
                <option disabled>Select an option</option>
                {Object.keys(EventType).map((type) => (
                  <option value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-1/3">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.number-of-guest",
                  })}
                </span>
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
            <div className="flex flex-col w-1/3">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.public-event",
                  })}
                </span>
              </label>
              <select
                name="publicEvent"
                className="select select-bordered"
                onChange={formik.handleChange}
                value={formik.values.publicEvent}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row mt-4">
            This event will take place on{" "}
            {formik.values.date
              ? format(new Date(formik.values.date), "PP")
              : " "}{" "}
            from {formik.values.time} until X.
          </div>
          <h1 className="text-lg font-bold text-primary mt-4">
            {intl.formatMessage({
              id: "new-event.form.header.location",
            })}
          </h1>
          {/* //todo: add google map */}
          {/* <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                placeholder="Type venue name, address"
                className="input input-bordered"
                name="location"
                onChange={formik.handleChange}
                value={formik.values.location}
              />
            </div>
          </div> */}
          <div className="flex flex-row justify-start space-x-4">
            <div className="flex flex-col w-full">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.address",
                  })}
                </span>
              </label>
              <input
                type="text"
                placeholder="Type venue name, address"
                className="input input-bordered"
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.city",
                  })}
                </span>
              </label>
              <input
                type="text"
                placeholder="Type venue name, address"
                className="input input-bordered"
                name="city"
                onChange={formik.handleChange}
                value={formik.values.city}
              />
            </div>
          </div>
          <div className="flex flex-row justify-start space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.state",
                  })}
                </span>
              </label>
              <input
                type="text"
                placeholder="Type venue name, address"
                className="input input-bordered"
                name="state"
                onChange={formik.handleChange}
                value={formik.values.state}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.zipcode",
                  })}
                </span>
              </label>
              <input
                type="text"
                placeholder="Type venue name, address"
                className="input input-bordered"
                name="zipCode"
                onChange={formik.handleChange}
                value={formik.values.zipCode}
              />
            </div>
          </div>
          <div className="flex flex-row mt-4">
            This place is X km away from your office. You will need X min to
            reach this location, and will cost you around X.
          </div>
          <h1 className="text-lg font-bold text-primary mt-4">
            {intl.formatMessage({
              id: "new-event.form.header.customer",
            })}
          </h1>
          <div className="flex flex-row justify-start space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.first-name",
                  })}
                </span>
              </label>
              <input
                type="text"
                placeholder=""
                className="input input-bordered"
                name="customer.firstName"
                onChange={formik.handleChange}
                value={formik.values.customer.firstName}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.last-name",
                  })}
                </span>
              </label>
              <input
                type="text"
                placeholder=""
                className="input input-bordered"
                name="customer.lastName"
                onChange={formik.handleChange}
                value={formik.values.customer.lastName}
              />
            </div>
          </div>
          <div className="flex flex-row justify-start space-x-4">
            <div className="flex flex-col w-1/2">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.phone-number",
                  })}
                </span>
              </label>
              <PhoneInput
                inputProps={{
                  name: "customer.phoneNumber",
                  required: true,
                  autoFocus: true,
                  className: "input input-bordered w-full",
                }}
                country={"fr"}
                value={formik.values.customer.phoneNumber}
                onChange={setPhoneNumber}
                enableAreaCodes={true}
                autoFormat={true}
                specialLabel=""
                showDropdown={false}
                disableDropdown={true}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="label">
                <span className="label-text">
                  {intl.formatMessage({
                    id: "new-event.form.label.email",
                  })}
                </span>
              </label>
              <input
                type="email"
                placeholder=""
                className="input input-bordered"
                name="customer.email"
                onChange={formik.handleChange}
                value={formik.values.customer.email}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            {intl.formatMessage({
              id: "new-event.form.submit",
            })}
          </button>
        </form>
        <div className="w-1/2 p-4">calendar map additionnal note</div>
      </div>
    </PageLayout>
  );
};

export default NewEvent;
