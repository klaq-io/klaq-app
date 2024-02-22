import * as Yup from 'yup';

export const initialValues = {
  text: '',
};

export const validationSchema = Yup.object({
  text: Yup.string().required('Required'),
});
