import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import {
  BankAccount,
  Calendar,
  Company,
  ConfirmMail,
  ConfirmMailVerify,
  ConfirmPhone,
  CustomerDetails,
  Customers,
  Dashboard,
  EditQuote,
  EnquiryForm,
  EventDetails2,
  Events,
  Integrations,
  InvoiceDetailsPage,
  InvoiceGenerate,
  Login,
  MainEventDetails,
  NewEvent,
  NewEventV2,
  OnboardingCompany,
  OnboardingCompanySearch,
  OnboardingIntermittent,
  OnboardingLegalFormChoice,
  OnboardingOffice,
  OnboardingPerformer,
  Products,
  Profile,
  QuoteGenerate,
  QuoteView,
  Quotes,
  ResetPassword,
  Security,
  SendQuote,
  Settings,
  SignUp,
} from "./pages";
import { ForgetPassword } from "./pages/ForgetPassword/ForgetPassword";
import { PATHS } from "./routes";
import PrivateRoutes from "./utils/PrivateRoute";
import TransitionComponent from "./utils/Transitions";
import { Invoice } from "pages/Billing/Invoice/Invoice";

const MINIMUM_SCREEN_SIZE = {
  width: 1000,
  height: 400,
};

function App() {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.SIGN_UP} element={<SignUp />} />
        <Route
          path={PATHS.CONFIRM_MAIL_VERIFY}
          element={<ConfirmMailVerify />}
        />
        <Route path={PATHS.CONFIRM_MAIL} element={<ConfirmMail />} />
        <Route path={PATHS.CONFIRM_SMS} element={<ConfirmPhone />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={PATHS.FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={PATHS.EMBEDDED_FORM} element={<EnquiryForm />} />
        <Route element={<PrivateRoutes />}>
          <Route path={PATHS.EVENTS} element={<Events />} />
          <Route
            path={PATHS.ONBOARDING_LEGAL_FORM_CHOICE}
            element={<OnboardingLegalFormChoice />}
          />
          <Route
            path={PATHS.ONBOARDING_COMPANY_SEARCH}
            element={<OnboardingCompanySearch />}
          />
          <Route
            path={PATHS.ONBOARDING_COMPANY}
            element={<OnboardingCompany />}
          />
          <Route
            path={PATHS.ONBOARDING_PERFORMER}
            element={<OnboardingPerformer />}
          />
          <Route
            path={PATHS.ONBOARDING_INTERMITTENT}
            element={<OnboardingIntermittent />}
          />
          <Route
            path={PATHS.ONBOARDING_OFFICE}
            element={<OnboardingOffice />}
          />
          <Route path={PATHS.CALENDAR} element={<Calendar />} />
          <Route path={PATHS.CUSTOMERS} element={<Customers />} />
          <Route path={PATHS.CUSTOMER_DETAILS} element={<CustomerDetails />} />
          <Route path={PATHS.EVENTS} element={<Events />} />
          <Route path={PATHS.EVENT_DETAILS} element={<MainEventDetails />} />
          <Route path={PATHS.NEW_EVENT_V2} element={<NewEventV2 />} />
          <Route path={PATHS.NEW_EVENT} element={<NewEvent />} />
          <Route path={PATHS.PRODUCTS} element={<Products />} />
          <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
          <Route
            path={PATHS.QUOTE_EDIT}
            element={
              <AnimatePresence mode="wait">
                <TransitionComponent>
                  <EditQuote />
                </TransitionComponent>
              </AnimatePresence>
            }
          />
          <Route
            path={PATHS.QUOTE_GENERATE}
            element={
              <AnimatePresence mode="wait">
                <TransitionComponent>
                  <QuoteGenerate />
                </TransitionComponent>
              </AnimatePresence>
            }
          />
          <Route
            path={PATHS.QUOTE_VIEW}
            element={
              <AnimatePresence mode="wait">
                <TransitionComponent>
                  <QuoteView />
                </TransitionComponent>
              </AnimatePresence>
            }
          />
          <Route path={PATHS.QUOTE_SEND_MAIL} element={<SendQuote />} />
          <Route path={PATHS.QUOTES} element={<Quotes />} />
          <Route path={PATHS.INVOICES} element={<Invoice />} />
          <Route
            path={PATHS.INVOICE_DETAILS}
            element={<InvoiceDetailsPage />}
          />
          <Route path={PATHS.INVOICE_GENERATE} element={<InvoiceGenerate />} />
          <Route path={PATHS.PROFILE} element={<Profile />} />
          <Route path={PATHS.COMPANY} element={<Company />} />
          <Route path={PATHS.INTEGRATIONS} element={<Integrations />} />
          <Route path={PATHS.BANK_ACCOUNT} element={<BankAccount />} />
          <Route path={PATHS.SECURITY} element={<Security />} />
          <Route path={PATHS.SETTINGS} element={<Settings />} />
          <Route path={PATHS.EVENT_V2} element={<EventDetails2 />} />
          <Route path="*" element={<Navigate to={PATHS.DASHBOARD} />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
