import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Calendar,
  Company,
  ConfirmMail,
  ConfirmMailVerify,
  ConfirmPhone,
  CustomerDetails,
  Customers,
  Dashboard,
  EditEvent,
  EventDetails,
  EventDetails2,
  Events,
  Login,
  NewEvent,
  OnboardingCompany,
  OnboardingCompanySearch,
  OnboardingIntermittent,
  OnboardingLegalFormChoice,
  OnboardingOffice,
  OnboardingPerformer,
  Products,
  Profile,
  QuoteDetails,
  ResetPassword,
  Settings,
  SignUp,
} from "./pages";
import { ForgetPassword } from "./pages/ForgetPassword/ForgetPassword";
import { PATHS } from "./routes";
import PrivateRoutes from "./utils/PrivateRoute";

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
          <Route path={PATHS.EVENT_EDIT} element={<EditEvent />} />
          <Route path={PATHS.EVENT} element={<EventDetails />} />
          <Route path={PATHS.NEW_EVENT} element={<NewEvent />} />
          <Route path={PATHS.PRODUCTS} element={<Products />} />
          <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
          <Route path={PATHS.PROFILE} element={<Profile />} />
          <Route path={PATHS.COMPANY} element={<Company />} />
          <Route path={PATHS.SETTINGS} element={<Settings />} />
          <Route path={PATHS.EVENT_V2} element={<EventDetails2 />} />
          <Route path={PATHS.EVENT_QUOTE_DETAILS} element={<QuoteDetails />} />
          <Route path="*" element={<Navigate to={PATHS.DASHBOARD} />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
