import {
  DiscountType,
  PaymentMethod,
} from 'interface/Invoice/invoice.interface';
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
    name: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
  },
  object: '',
  paymentMethod: PaymentMethod.CHECK,
  onlinePaymentAccepted: false,
  isFinal: false,
};

export const validationSchema = Yup.object().shape({
  issuedOn: Yup.string().required('Required'),
  validUntil: Yup.string().required('Required'),
  products: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number().required('Required'),
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      vtaRate: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
      discount: Yup.number().required('Required'),
      discountType: Yup.string().required('Required'),
    }),
  ),
  orderFormId: Yup.string(),
  object: Yup.string(),
  paymentMethod: Yup.string().required('Required'),
  onlinePaymentAccepted: Yup.boolean().required('Required'),
});
