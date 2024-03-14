import * as Yup from 'yup';

export const initialValues = {
  to: '',
  subject: '',
  message: '',
  cc: true,
};

export const validationSchema = Yup.object().shape({
  to: Yup.string().email().required(),
  subject: Yup.string().required(),
  message: Yup.string().required(),
});
