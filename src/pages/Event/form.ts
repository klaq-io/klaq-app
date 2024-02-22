import * as Yup from 'yup';
import { CustomerType } from '../../redux/Customer/slices';

export const initialValuesEditEvent = {
  date: '',
  startTime: '',
  endTime: '',
  eventType: 'wedding',
  numberOfGuests: 0,
  publicEvent: 'yes',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    phone: '0606060606',
    type: CustomerType.PRIVATE,
  },
  products: [
    {
      id: '',
      quantity: 0,
      productId: '',
    },
  ],
};

export const validationSchemaEditEvent = Yup.object({});

export const initialValuesNewEvent = {
  date: '',
  startTime: '',
  endTime: '',
  eventType: 'wedding',
  numberOfGuests: 0,
  publicEvent: 'yes',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    type: 'PRIVATE',
    name: '',
  },
  coordinates: {
    longitude: 0,
    latitude: 0,
  },
};

export const validationSchemaNewEvent = Yup.object({
  date: Yup.date().required('Required'),
  startTime: Yup.string().required('Required'),
  endTime: Yup.string().required('Required'),
  eventType: Yup.string().required('Required'),
  numberOfGuests: Yup.number().required('Required'),
  publicEvent: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  zipcode: Yup.string()
    .matches(/^\d{5}$/, 'Invalid zipcode')
    .required('Required'),
  customer: Yup.object({}).shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string().required('Required'),
  }),
});
