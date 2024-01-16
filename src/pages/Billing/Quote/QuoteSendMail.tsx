import { useFormik } from "formik";
import { initialValues } from "./sendQuoteForm";
import { PageLayout } from "layouts";
import { Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { getInvoice } from "redux/Invoice/selectors";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CardContainer, TextField } from "components";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import {
  useDownloadInvoicePDF,
  useFetchInvoice,
  useSendInvoiceByEmail,
} from "redux/Invoice/hooks";
import { useFetchUser } from "redux/Login/hooks";
import { getUser } from "redux/Login/selectors";
import { CustomerType } from "redux/Customer/slices";
import {
  DiscountType,
  InvoiceProduct,
} from "interface/Invoice/invoice.interface";
import {
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { getQuoteById } from "redux/Quote/selectors";
import { useFetchQuote, useSendQuote } from "redux/Quote/hooks";
import { PATHS } from "routes";

export const QuoteSendMailPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();
  const [{ isLoading }, fetchQuote] = useFetchQuote();
  const [{ isLoading: isSending }, sendQuoteByEmail] = useSendQuote();
  const [, fetchUser] = useFetchUser();

  const quote = useSelector((state: any) => getQuoteById(state, id!));
  const user = useSelector(getUser);

  //   const [{ isLoading: isDownloadingInvoice }, downloadInvoice] =
  //     useDownloadInvoicePDF();

  const isCustomerPro =
    quote && quote.mainEvent.customer.type === CustomerType.COMPANY;

  const formik = useFormik({
    initialValues: quote
      ? {
          ...initialValues,
          to: quote.mainEvent.customer.email,
          subject: intl.formatMessage({
            id: "quote.send.default.subject",
          }),
          message: intl.formatMessage(
            {
              id: "quote.send.default.message",
            },
            {
              stageName: user.stageName,
              type: quote.mainEvent.title.toLowerCase(),
              date: quote
                ? new Date(
                    quote.mainEvent.subEvents[0].date
                  ).toLocaleDateString()
                : "",
            }
          ),
        }
      : initialValues,
    onSubmit: async (values) => {
      await sendQuoteByEmail(values, id!);
      navigate(PATHS.QUOTE + "/" + id + "/details");
    },
    enableReinitialize: true,
  });

  const getProductSubtotal = (product: InvoiceProduct) => {
    const discount =
      product.discountType === DiscountType.PERCENT
        ? product.price * (product.discount / 100)
        : product.discount;
    return product.price * product.quantity - discount;
  };

  const subtotal =
    quote?.products.reduce(
      (acc, product) => acc + getProductSubtotal(product),
      0
    ) || 0;

  const tax =
    quote?.products.reduce(
      (acc, product) =>
        acc + getProductSubtotal(product) * (Number(product.vtaRate) / 100),
      0
    ) || 0;

  const total = subtotal + tax;

  useEffect(() => {
    fetchQuote(id);
    fetchUser();
  }, []);

  return (
    <PageLayout>
      {quote && (
        <div className="flex flex-col space-y-8 h-full">
          <Transition
            show={!isLoading && !!quote}
            enter="transition ease duration-500 transform"
            enterFrom="opacity-0 translate-y-12"
            enterTo="opacity-100 translate-y-0"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="h-full"
          >
            <form onSubmit={formik.handleSubmit}>
              <div className="sm:flex sm:space-x-4 h-full">
                <CardContainer className="flex flex-col space-y-8 px-4 py-5 sm:p-6 w-full sm:w-1/2">
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
                </CardContainer>
                <CardContainer className="flex flex-col space-y-4 px-4 py-5 sm:p-6 w-full h-full sm:w-1/2">
                  <TextField
                    label={intl.formatMessage({
                      id: "quote.send.label.to",
                    })}
                    name="to"
                    value={formik.values.to}
                    type="email"
                    onChange={formik.handleChange}
                  />
                  <TextField
                    label={intl.formatMessage({
                      id: "quote.send.label.object",
                    })}
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                  />
                  <>
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
                  </>
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
                  <div className="flex space-x-4 pt-4">
                    <Button
                      leadingIcon={<ArrowDownTrayIcon className="w-5 h-5" />}
                      type="button"
                      variant="outlined"
                      color="primary"
                      //   onClick={() =>
                      //     quote
                      //       ? downloadInvoice(quote.id, quote.number)
                      //       : null
                      //   }
                      //   isLoading={isDownloadingInvoice}
                    >
                      {intl.formatMessage({
                        id: "quote.send.button.download",
                      })}
                    </Button>
                    <Button
                      leadingIcon={<PaperAirplaneIcon className="w-5 h-5" />}
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={formik.submitForm}
                      isLoading={isSending}
                    >
                      {intl.formatMessage({
                        id: "quote.send.button.send",
                      })}
                    </Button>
                  </div>
                </CardContainer>
              </div>
            </form>
          </Transition>
        </div>
      )}
    </PageLayout>
  );
};
