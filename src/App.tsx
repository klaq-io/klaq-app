import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Dashboard, Login } from "./pages";
import { PATHS } from "./routes";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.SIGN_UP} element={<div>SignUp</div>} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route
          path={PATHS.DASHBOARD}
          element={
            // <PrivateRoute>
            <Dashboard />
            // </PrivateRoute>
          }
        />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
