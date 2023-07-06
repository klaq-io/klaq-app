import { useFormik } from "formik";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import SidePanel from "../../components/SidePanel";
import {
  useEditProductItem,
  useFetchProductItems,
} from "../../redux/Products/hooks";
import { getProductById } from "../../redux/Products/selectors";
import { classNames } from "../../utils/classNames";
import { initialValues, validationSchemaEdit } from "./form";

type Props = {
  openSidePanel: boolean;
  setOpenSidePanel: (open: boolean) => void;
  productId: string;
};

export const EditProduct = (props: Props) => {
  const intl = useIntl();
  const [{ isLoading }, editProduct] = useEditProductItem();
  const [, fetchProducts] = useFetchProductItems();
  const [currentVTARate, setCurrentVTARate] = useState("20");

  const { openSidePanel, setOpenSidePanel, productId } = props;

  const VTA_RATES = ["0", "2.1", "5.5", "10", "20"];

  const product = useSelector((state: any) =>
    getProductById(state, productId!)
  );

  const formik = useFormik({
    initialValues: product || initialValues,
    validationSchema: validationSchemaEdit,
    onSubmit: async (values, { resetForm }) => {
      editProduct(values, productId);
      setOpenSidePanel(false);
      resetForm();
    },
    enableReinitialize: true,
  });

  const handleVTAChange = (vta: string) => {
    formik.setValues({ ...formik.values, vtaRate: vta });
    setCurrentVTARate(vta);
  };

  return (
    <SidePanel
      open={openSidePanel}
      setOpen={setOpenSidePanel}
      titleId={"products.edit-product.header"}
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
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "products.new-product.label.short-description",
              })}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="description"
                id="description"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "products.new-product.input.short-description",
                })}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              {formik.errors.description && formik.touched.description ? (
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
                  key={`tva-${rate}`}
                  type="button"
                  onClick={() => handleVTAChange(rate)}
                  className={classNames(
                    rate === currentVTARate
                      ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                    "rounded-md px-3.5 py-2.5 text-sm font-semibold shadom-sm"
                  )}
                >
                  {rate}%
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
              htmlFor="price"
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
                type="number"
                name="price"
                id="price"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "products.new-product.input.default-price",
                })}
                aria-describedby="price-currency"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
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
            {formik.values.price ? (
              <p className="mt-2 text-sm text-gray-500" id="email-error">
                {intl.formatMessage(
                  {
                    id: "products.new-product.label.default-price-with-vta",
                  },
                  {
                    price: (
                      formik.values.price *
                      (1 + parseInt(formik.values.vtaRate) / 100)
                    ).toFixed(2),
                  }
                )}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="submit"
          className="absolute mt-8 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {intl.formatMessage({
            id: "products.edit-product.submit",
          })}
        </button>
      </form>
    </SidePanel>
  );
};
