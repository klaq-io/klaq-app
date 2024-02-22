import * as Yup from 'yup';

export const initialValues = {
  email: '',
  password: '',
  phone: '',
};

export const validationSchema = Yup.object({
  email: Yup.string().required('Required'),
  password: Yup.string()
    .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{10,}$/)
    .required('Required'),
  phone: Yup.string().required('Required'),
});
