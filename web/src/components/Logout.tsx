import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/api";
import { LoginParams } from "./Login";
import Button from "@mui/material/Button";

const Logout = ({ setAuth }: LoginParams) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("auth/logout/");
      setAuth(null);
      sessionStorage.removeItem("wsauth");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outlined"
      sx={{ my: 2, color: "white", display: "block" }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default Logout;
