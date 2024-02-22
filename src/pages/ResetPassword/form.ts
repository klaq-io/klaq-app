import * as Yup from 'yup';

export const initialValues = {
  password: '',
  confirmPassword: '',
};

export const validationSchema = Yup.object({
  password: Yup.string()
    .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{10,}$/)
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Does not match')
    .required(),
});
