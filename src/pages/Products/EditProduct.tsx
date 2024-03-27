import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import SidePanel from 'components/SidePanel';
import {
  useEditProductItem,
  useFetchProductItems,
} from '../../redux/Products/hooks';
import { getProductById } from '../../redux/Products/selectors';
import { classNames } from '../../utils/utils';
import { initialValues, validationSchemaEdit } from './form';
import { Button, TextArea } from 'components';

type Props = {
  shouldOpenSidePanel: boolean;
  setOpenSidePanel: (isOpen: boolean) => void;
  productId: string;
};

export const EditProduct = (props: Props) => {
  const intl = useIntl();
  const [, editProduct] = useEditProductItem();
  const [, fetchProducts] = useFetchProductItems();
  const [currentVTARate, setCurrentVTARate] = useState('20');

  const { shouldOpenSidePanel, setOpenSidePanel, productId } = props;

  const VTA_RATES = ['0', '2.1', '5.5', '10', '20'];

  const product = useSelector((state: any) => getProductById(state, productId));

  const formik = useFormik({
    initialValues: product || initialValues,
    validationSchema: validationSchemaEdit,
    onSubmit: async (values, { resetForm }) => {
      editProduct(values, productId);
      setOpenSidePanel(false);
      resetForm();
      fetchProducts();
    },
    enableReinitialize: true,
  });

  const handleVTAChange = (vta: string) => {
    formik.setValues({ ...formik.values, vtaRate: vta });
    setCurrentVTARate(vta);
  };

  return (
    <SidePanel
      isOpen={shouldOpenSidePanel}
      setOpen={setOpenSidePanel}
      titleId={'products.edit-product.header'}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: 'products.new-product.label.name',
              })}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: 'products.new-product.input.name',
                })}
                onChange={formik.handleChange}
                value={formik.values.title}
              />
              {formik.errors.title && formik.touched.title ? (
                <p className="mt-2 text-sm text-danger-600" id="email-error">
                  {intl.formatMessage({
                    id: 'products.new-product.error.name',
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <TextArea
              name="description"
              label={intl.formatMessage({
                id: 'products.new-product.label.short-description',
              })}
              placeholder={intl.formatMessage({
                id: 'products.new-product.input.short-description',
              })}
              onChange={formik.handleChange}
              value={formik.values.description}
              error={
                formik.errors.description && formik.touched.description
                  ? intl.formatMessage({
                      id: 'products.new-product.error.short-description',
                    })
                  : ''
              }
            />
          </div>

          <div>
            <label
              htmlFor="vtaRate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: 'products.new-product.label.default-vta-rate',
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
                      ? 'bg-klaq-600 text-white hover:bg-klaq-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                    'rounded-md px-3.5 py-2.5 text-sm font-semibold shadom-sm',
                  )}
                >
                  {rate}%
                </button>
              ))}
              {formik.errors.vtaRate && formik.touched.vtaRate ? (
                <p className="mt-2 text-sm text-danger-600" id="email-error">
                  {intl.formatMessage({
                    id: 'products.new-product.error.default-vta-rate',
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
                id: 'products.new-product.label.default-price',
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
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: 'products.new-product.input.default-price',
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
                  id: 'products.new-product.error.default-price',
                })}
              </p>
            ) : null}
            {formik.values.price ? (
              <p className="mt-2 text-sm text-gray-500" id="email-error">
                {intl.formatMessage(
                  {
                    id: 'products.new-product.label.default-price-with-vta',
                  },
                  {
                    price: (
                      formik.values.price *
                      (1 + parseInt(formik.values.vtaRate) / 100)
                    ).toFixed(2),
                  },
                )}
              </p>
            ) : null}
          </div>
        </div>
        <div className="my-6">
          <Button color="primary" variant="contained" type="submit">
            {intl.formatMessage({
              id: 'products.edit-product.submit',
            })}
          </Button>
        </div>
      </form>
    </SidePanel>
  );
};
