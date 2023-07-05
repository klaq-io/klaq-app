import { DocumentPlusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PageLayout } from "../../layouts";
import SidePanel from "../../components/SidePanel";
import { useState } from "react";
import { classNames } from "../../utils/classNames";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./form";

export const Products = () => {
  const intl = useIntl();

  const [currentVTARate, setCurrentVTARate] = useState(20);
  const [openSidePanel, setOpenSidePanel] = useState(false);

  const handleOpenSidePanel = () => {
    setOpenSidePanel(true);
  };

  const handleVTAChange = (vta: number) => {
    formik.setValues({ ...formik.values, vtaRate: vta });
    setCurrentVTARate(vta);
  };

  const VTA_RATES = [
    {
      percent: 0,
    },
    {
      percent: 2.1,
    },
    {
      percent: 5.5,
    },
    {
      percent: 10,
    },
    {
      percent: 20,
    },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <PageLayout>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {intl.formatMessage({
              id: "products.title",
            })}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {intl.formatMessage({
              id: "products.description",
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex-1 mt-10">
          <div className="px-4 sm:px-0">
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              sit amet elit laoreet, maximus neque in, hendrerit lectus. Integer
              ultricies sapien libero, sed vestibulum dui sollicitudin quis.
              Nunc placerat eget nisl ut finibus. Nunc leo mauris, lacinia a
              blandit in, interdum sed nulla. Curabitur posuere venenatis
              libero, nec finibus massa scelerisque in.
            </p>
            <h3 className="text-base font-semibold leading-7 text-blue-600"></h3>
          </div>
          <div className="mt-6">
            <button
              onClick={handleOpenSidePanel}
              type="button"
              className="relative block sm:w-1/2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusIcon
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              />

              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {intl.formatMessage({
                  id: "products.no-product",
                })}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {intl.formatMessage({
                  id: "products.get-started",
                })}
              </p>
            </button>
          </div>
        </div>
      </div>

      <SidePanel
        open={openSidePanel}
        setOpen={setOpenSidePanel}
        titleId={"products.new-product.header"}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {intl.formatMessage({
                  id: "products.new-product.label.name",
                })}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder={intl.formatMessage({
                    id: "products.new-product.input.name",
                  })}
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
                {formik.errors.title && formik.touched.title ? (
                  <p className="mt-2 text-sm text-danger-600" id="email-error">
                    {intl.formatMessage({
                      id: "products.new-product.error.name",
                    })}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {intl.formatMessage({
                  id: "products.new-product.label.short-description",
                })}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="shortDescription"
                  id="shortDescription"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder={intl.formatMessage({
                    id: "products.new-product.input.short-description",
                  })}
                  onChange={formik.handleChange}
                  value={formik.values.shortDescription}
                />
                {formik.errors.shortDescription &&
                formik.touched.shortDescription ? (
                  <p className="mt-2 text-sm text-danger-600" id="email-error">
                    {intl.formatMessage({
                      id: "products.new-product.error.short-description",
                    })}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <label
                htmlFor="attachFile"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {intl.formatMessage({
                  id: "products.new-product.label.attach-file",
                })}
              </label>
              <div className="mt-2">
                {/** TODO: change by a download input component */}
                <button className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mx-auto  text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>

                  <span className="mt-2 block text-sm font-semibold text-gray-900">
                    {intl.formatMessage({
                      id: "products.new-product.input.attach-file",
                    })}
                  </span>
                  <input
                    name="files"
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    // onChange={formik.handleChange}
                    // value={formik.values.files}
                  />
                  {formik.errors.files && formik.touched.files ? (
                    <p
                      className="mt-2 text-sm text-danger-600"
                      id="email-error"
                    >
                      {intl.formatMessage({
                        id: "products.new-product.error.attach-file",
                      })}
                    </p>
                  ) : null}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="vtaRate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {intl.formatMessage({
                  id: "products.new-product.label.default-vta-rate",
                })}
              </label>
              <div className="flex flex-row space-x-4 mt-2">
                {VTA_RATES.map((rate) => (
                  <button
                    key={rate.percent}
                    type="button"
                    onClick={() => handleVTAChange(rate.percent)}
                    className={classNames(
                      rate.percent === currentVTARate
                        ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                      "rounded-md px-3.5 py-2.5 text-sm font-semibold shadom-sm"
                    )}
                  >
                    {rate.percent}%
                  </button>
                ))}
                {formik.errors.vtaRate && formik.touched.vtaRate ? (
                  <p className="mt-2 text-sm text-danger-600" id="email-error">
                    {intl.formatMessage({
                      id: "products.new-product.error.default-vta-rate",
                    })}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="defaultPrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {intl.formatMessage({
                  id: "products.new-product.label.default-price",
                })}
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  type="text"
                  name="defaultPrice"
                  id="defaultPrice"
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder={intl.formatMessage({
                    id: "products.new-product.input.default-price",
                  })}
                  aria-describedby="price-currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    EUR
                  </span>
                </div>
              </div>
              {formik.errors.price && formik.touched.price ? (
                <p className="mt-2 text-sm text-danger-600" id="email-error">
                  {intl.formatMessage({
                    id: "products.new-product.error.default-price",
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="absolute m-4 bottom-0 right-0 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {intl.formatMessage({
              id: "products.new-product.submit",
            })}
          </button>
        </form>
      </SidePanel>
    </PageLayout>
  );
};
