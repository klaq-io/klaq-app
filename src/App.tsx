import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import {
  ConfirmMail,
  ConfirmPhone,
  Dashboard,
  EditEvent,
  Event,
  Events,
  Login,
  NewEvent,
  OnboardingCompany,
  OnboardingCompanySearch,
  OnboardingLegalFormChoice,
  Products,
  SignUp,
} from "./pages";
import { ForgetPassword } from "./pages/ForgetPassword/ForgetPassword";
import { PATHS } from "./routes";

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

  return dimensions.width <= MINIMUM_SCREEN_SIZE.width ||
    dimensions.height <= MINIMUM_SCREEN_SIZE.height ? (
    <div>no phone supported</div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.SIGN_UP} element={<SignUp />} />
        <Route path={PATHS.CONFIRM_MAIL} element={<ConfirmMail />} />
        <Route path={PATHS.CONFIRM_SMS} element={<ConfirmPhone />} />
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
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={PATHS.EVENTS} element={<Events />} />
        <Route path={PATHS.EVENT_EDIT} element={<EditEvent />} />
        <Route path={PATHS.EVENT} element={<Event />} />
        <Route path={PATHS.NEW_EVENT} element={<NewEvent />} />
        <Route path={PATHS.PRODUCTS} element={<Products />} />
        <Route
          path={PATHS.DASHBOARD}
          element={
            // <PrivateRoute>
            <Dashboard />
            // </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
