import React, { useState } from "react";
import axiosInstance from "../lib/api";
import { LoginParams } from "./Login";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const Register = ({ setAuth }: LoginParams) => {
  const [details, setDetails] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const validateInputs = () => {
    let isValid = true;
    // We should should sanitize and apply any validations here
    if (!details.password || details.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setMessage("");
    }

    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;
    try {
      const response = await axiosInstance.post("register/", details);
      const wsauth = JSON.stringify({
        username: response.data.username,
        token: response.data.token,
      });
      sessionStorage.setItem("wsauth", wsauth);
      setAuth(wsauth);
    } catch (error) {
      setMessage("Error during registration.");
    }
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Register
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handleInputChange}
          />
        </FormControl>
        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={handleSubmit}
        >
          Register
        </Button>

        <p>{message}</p>
      </Box>
    </>
  );
};

export default Register;
