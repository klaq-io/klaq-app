import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Dashboard, Login, NewEvent } from "./pages";
import { PATHS } from "./routes";
import PrivateRoute from "./utils/PrivateRoute";
import { ForgetPassword } from "./pages/ForgetPassword/ForgetPassword";
import { useState, useEffect } from "react";

const MINIMUM_SCREEN_SIZE = {
  width: 1000,
  height: 600,
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
    <div className="flex justify-center bg-primary h-full">
      <div className="card w-96 bg-base-100 shadow-xl m-6">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Oups!</h2>
          <p className="text-xl">
            Please use a computer to use{" "}
            <span className="font-bold">Klaq.io</span>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.SIGN_UP} element={<div>SignUp</div>} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.FORGET_PASSWORD} element={<ForgetPassword />} />
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
  );
}

export default App;
