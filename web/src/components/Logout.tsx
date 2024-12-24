import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/api";
import { LoginParams } from "./Login";

const Logout = ({ setAuth }: LoginParams) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("auth/logout/");
      setAuth(null);
      sessionStorage.removeItem("wsauth");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
