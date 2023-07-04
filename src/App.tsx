import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Dashboard, Events, Login, NewEvent } from "./pages";
import { PATHS } from "./routes";
import PrivateRoute from "./utils/PrivateRoute";
import { ForgetPassword } from "./pages/ForgetPassword/ForgetPassword";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

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
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.SIGN_UP} element={<div>SignUp</div>} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={PATHS.EVENTS} element={<Events />} />
        <Route path={PATHS.NEW_EVENT} element={<NewEvent />} />
        <Route
          path={PATHS.DASHBOARD}
          element={
            // <PrivateRoute>
            <Dashboard />
            // </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.SIGN_UP} element={<div>SignUp</div>} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={PATHS.EVENTS} element={<Events />} />
        <Route path={PATHS.NEW_EVENT} element={<NewEvent />} />
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
