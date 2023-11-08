import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { SuperBalls } from "@uiball/loaders";
import KlaqIcon from "assets/klaq.png";
import { Label, MapAutocompleteInput, TextField } from "components";
import { Alert } from "components/Alert/Alert";
import { useFormik } from "formik";
import { RetrieveAddress } from "interface/retrieve-address.interface";
import { createRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useSearchParams } from "react-router-dom";
import { useCreateEnquiry } from "redux/Enquiry/hook";
import * as Yup from "yup";

const validationSchema = Yup.object({
  type: Yup.string().required("Ce champ est requis"),
  firstName: Yup.string().required("Ce champ est requis"),
  lastName: Yup.string().required("Ce champ est requis"),
  phone: Yup.string().required("Ce champ est requis"),
  email: Yup.string().email().required("Ce champ est requis"),
  date: Yup.string().required("Ce champ est requis"),
  address: Yup.string().required("Ce champ est requis"),
  note: Yup.string(),
  guests: Yup.number().min(0),
});

export const EnquiryForm = () => {
  const [params, setParams] = useSearchParams();
  const recaptchaRef = createRef<ReCAPTCHA>();
  const [isSent, setIsSent] = useState(false);
  const token = params.get("token");

  const [{ isLoading }, createEnquiry] = useCreateEnquiry();

  const formik = useFormik({
    initialValues: {
      type: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      date: "",
      address: "",
      note: "",
      guests: 0,
      city: "",
      zipcode: "",
      country: "",
    },
    onSubmit: async (values) => {
      await recaptchaRef.current?.executeAsync();
      const recaptchaToken = recaptchaRef.current?.getValue();

      if (recaptchaToken) {
        createEnquiry(values, token);
      }
      setIsSent(true);
    },
    validationSchema,
  });

  const handleRetrieveAddress = (retrieveAddress: RetrieveAddress) => {
    const { address, city, zipcode, country } = retrieveAddress;

    formik.setFieldValue("address", address);
    formik.setFieldValue("city", city);
    formik.setFieldValue("zipcode", zipcode);
    formik.setFieldValue("country", country);
  };

  return (
    <>
      {!token && (
        <Alert status="danger" title={"Erreur propriétaire"}>
          Token d'authentification invalide, veuillez contacter le support.
        </Alert>
      )}
      {!isSent ? (
        <form onSubmit={formik.handleSubmit} className="bg-white h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1">
              <TextField
                variant="black"
                name="firstName"
                label="Prénom*"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                placeholder="Prénom"
              />
            </div>
            <div className="col-span-1">
              <TextField
                variant="black"
                name="lastName"
                label="Nom*"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                placeholder="Nom"
              />
            </div>
            <div className="col-span-1">
              <TextField
                variant="black"
                name="email"
                label="Email*"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="nom@email.com"
              />
            </div>
            <div className="col-span-1">
              <TextField
                variant="black"
                name="phone"
                label="Téléphone*"
                onChange={formik.handleChange}
                value={formik.values.phone}
                placeholder="06 12 34 56 78"
              />
            </div>
            <div className="col-span-1">
              <TextField
                variant="black"
                name="type"
                label="Type d'évènement*"
                value={formik.values.type}
                onChange={formik.handleChange}
                placeholder="Mariage, anniversaire, baptême..."
              />
            </div>
            <div className="col-span-1">
              <TextField
                variant="black"
                type="date"
                name="date"
                label="Date de l'évènement*"
                value={formik.values.date}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-span-1">
              <TextField
                variant="black"
                type="number"
                name="guests"
                label="Nombre d'invités approximatif"
                value={formik.values.guests}
                onChange={formik.handleChange}
                min={0}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="address">Lieu*</Label>
              <MapAutocompleteInput
                setAddress={handleRetrieveAddress}
                defaultAddress=""
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="note">
                Informations complémentaires sur votre évènement
              </Label>
              <textarea
                value={formik.values.note}
                onChange={formik.handleChange}
                rows={4}
                name="note"
                id="text"
                placeholder="N'hésitez pas à être le plus précis possible ! Cela n'engage à rien. Je prends le temps dès le premier contact d'apprendre à vous connaître pour répondre parfaitement à vos besoins."
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="col-span-full">
              <div className="flex flex-row items-center space-x-8">
                <button
                  type="submit"
                  className="inline-flex items-center gap-x-2 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Envoyer
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <a
                  target="_blank"
                  href="https://klaq.io"
                  className="inline-flex items-center gap-x-2"
                >
                  <img
                    src={KlaqIcon}
                    alt="Klaq logo"
                    className="w-12 h-12 rounded-md"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    Powered by Klaq
                  </span>
                </a>
                <ReCAPTCHA
                  badge="bottomright"
                  ref={recaptchaRef}
                  sitekey="6Lc-tQEpAAAAAAhXWrfgbVLLuwa6m3PG65g6iu1S"
                  size="invisible"
                />
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white min-h-screen">
          <div className="flex flex-col items-center justify-center h-screen">
            {isLoading ? (
              <SuperBalls size={45} speed={1.4} color="black" />
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Votre demande a bien été envoyée - Merci !
                </h1>
                <a
                  target="_blank"
                  href="https://klaq.io"
                  className="inline-flex items-center gap-x-2"
                >
                  <img
                    src={KlaqIcon}
                    alt="Klaq logo"
                    className="w-12 h-12 rounded-md"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    Powered by Klaq
                  </span>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
