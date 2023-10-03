import {
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchUser } from "redux/Login/hooks";
import { getUser } from "redux/Login/selectors";
import { useFetchQuote } from "redux/Quote/hooks";
import { getQuoteById } from "redux/Quote/selectors";
import { PATHS } from "routes";
import { initialValues } from "./sendQuoteForm";
import { CustomerType } from "redux/Customer/slices";
import { Button } from "components";

export const SendQuote = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const [, fetchQuote] = useFetchQuote();
  const quote = useSelector((state: any) => getQuoteById(state, id!));

  const [, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const handlePrevious = () => {
    if (quote) navigate(`${PATHS.EVENTS}/${quote.event.id && ""}`);
  };

  const formik = useFormik({
    initialValues:
      quote && quote.event && quote.event.customer
        ? {
            ...initialValues,
            to: quote.event.customer.email,
            subject: intl.formatMessage({
              id: "quote.send.default.subject",
            }),
            message: intl.formatMessage(
              {
                id: "quote.send.default.message",
              },
              {
                stageName: user.stageName,
                eventType: intl
                  .formatMessage({
                    id: `events.types.${quote.event.eventType}`,
                  })
                  .toLowerCase(),
                eventDate: new Date(quote.event.date).toLocaleDateString(),
              }
            ),
          }
        : initialValues,
    onSubmit: async (values) => {
      console.log(JSON.stringify(values, null, 2));
      alert(values);
    },
    enableReinitialize: true,
  });

  const isCustomerPro =
    quote &&
    quote.event &&
    quote.event.customer &&
    quote.event.customer.type === CustomerType.COMPANY;

  const subtotal =
    (quote &&
      quote.products &&
      quote?.products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      )) ||
    0;

  const tax =
    (quote &&
      quote.products &&
      quote?.products.reduce(
        (acc, product) =>
          acc +
          (product.price * product.quantity * Number(product.vtaRate)) / 100,
        0
      )) ||
    0;

  const total = isCustomerPro ? subtotal : subtotal + tax;

  useEffect(() => {
    fetchQuote(id!);
    fetchUser();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 min-h-screen">
        <div className="grid grid-cols-2 bg-gray-100 shadow-sm ring-1 ring-gray-900/5 sm:rounded-l-xl overflow-hidden col-span-2 py-12 px-12">
          <div className="bg-white shadow-lg ring-1 ring-gray-900/5 m-auto col-span-2 w-[600px]">
            <div className="p-8 flex flex-col space-y-4">
              <img
                className="m-auto"
                src={user.logoUrl}
                width={100}
                height={100}
              />
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {formik.values.subject}
              </h3>
              <p className="text-sm text-gray-500 whitespace-pre-line">
                {formik.values.message}
              </p>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                <dt className="col-end-1 ">
                  {intl.formatMessage({
                    id: "quote.send.content.quote-number",
                  })}
                </dt>
                <dd className="text-gray-900 font-semibold">
                  {quote && quote.number}
                </dd>
                <dt className="col-end-1 ">
                  {intl.formatMessage({
                    id: "quote.send.content.valid-until",
                  })}
                </dt>
                <dd className="text-gray-900 font-semibold">
                  {quote && new Date(quote.issuedOn).toLocaleDateString()}
                </dd>
                <dt className="col-end-1 ">
                  {intl.formatMessage({
                    id: `quote.send.content.total.${
                      isCustomerPro ? "tax-excluded" : "tax-included"
                    }`,
                  })}
                </dt>
                <dd className="text-gray-900 font-semibold">
                  {total.toFixed(2)} €
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-r-xl overflow-hidden col-span-1 flex flex-col overflow-y-scroll">
          <div className="py-6 px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {intl.formatMessage({
                  id: "quote.send.header",
                })}
              </h3>
              <button
                onClick={handlePrevious}
                type="button"
                className="ml-auto rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">
              <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.send.label.to",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="to"
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        value={formik.values.to}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.send.label.object",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="subject"
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.send.label.message",
                      })}
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={8}
                        name="message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="cc"
                        name="cc"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-klaq-600 focus:ring-klaq-600"
                        checked={formik.values.cc}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label className="font-medium text-gray-900">
                        {intl.formatMessage(
                          {
                            id: "quote.send.label.cc",
                          },
                          {
                            email: user.email,
                          }
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-row mt-auto p-8 space-x-4">
            <Button
              leadingIcon={<ArrowDownTrayIcon className="w-5 h-5" />}
              type="button"
              variant="outlined"
              color="primary"
            >
              Télécharger
            </Button>
            <Button
              leadingIcon={<PaperAirplaneIcon className="w-5 h-5" />}
              type="submit"
              variant="contained"
              color="primary"
              onClick={formik.submitForm}
            >
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
