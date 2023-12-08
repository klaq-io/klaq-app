import * as Yup from "yup";

export const initialValues = {
  issuedOn: "",
  validUntil: "45",
  products: [
    {
      quantity: 1,
      title: "",
      description: "",
      vtaRate: "20",
      price: 0,
      discount: 0,
      discountType: "percent",
      total: 0,
    },
  ],
  orderFormId: "",
  customer: {
    name: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
  },
  object: "",
  paymentType: "cash",
  onlinePaymentAccepted: false,
};

export const validationSchema = Yup.object().shape({
  issuedOn: Yup.date().required("Required"),
  validUntil: Yup.date().required("Required"),
  products: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number().required("Required"),
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      vtaRate: Yup.string().required("Required"),
      price: Yup.number().required("Required"),
    })
  ),
  orderFormId: Yup.string().max(16),
});
