import { Component, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuth } from "../redux/Login/hooks";
import { PATHS } from "../routes";

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [, checkAuth] = useCheckAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsAuthenticated(await checkAuth());
    };
    checkAuthentication();
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to={PATHS.LOGIN} />;
};

export default PrivateRoutes;
