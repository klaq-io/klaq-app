import { DiscountType } from 'interface/Invoice/invoice.interface';
import * as Yup from 'yup';

export const initialValues = {
  issuedOn: '',
  validUntil: '',
  products: [
    {
      quantity: 1,
      title: '',
      description: '',
      vtaRate: '20',
      price: 0,
      discount: 0,
      discountType: DiscountType.PERCENT,
    },
  ],
  orderFormId: '',
  customer: {
    address: '',
    city: '',
    country: '',
    zipcode: '',
    name: '',
  },
  object: '',
};

export const validationSchema = Yup.object().shape({
  issuedOn: Yup.date().required('Required'),
  validUntil: Yup.date().required('Required'),
  products: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number().required('Required'),
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      vtaRate: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
    }),
  ),
  orderFormId: Yup.string().max(16),
});
