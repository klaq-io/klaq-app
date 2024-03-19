import * as Yup from 'yup';

export const initialValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  stageName: '',
  birthDate: '',
  publicEmail: '',
  publicPhone: '',
  website: '',
  biography: '',
};

export const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  phone: Yup.string().required('Required'),
  stageName: Yup.string().required('Required'),
  birthDate: Yup.string().required('Required'),
  publicEmail: Yup.string().required('Required'),
  publicPhone: Yup.string().required('Required'),
  website: Yup.string().notRequired(),
  biography: Yup.string().notRequired(),
});
