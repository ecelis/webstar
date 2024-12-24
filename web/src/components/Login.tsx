import React, { useState } from "react";
import axiosInstance from "../lib/api";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface LoginParams {
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login = ({ setAuth }: LoginParams) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("login/", credentials);
      const wsauth = JSON.stringify({
        username: response.data.username,
        token: response.data.token,
      });
      sessionStorage.setItem("wsauth", wsauth);
      setAuth(wsauth);
    } catch (error) {
      setMessage("Invalid credentials.");
    }
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Log in
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
            type="username"
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
          Sign in
        </Button>

        <p>{message}</p>
      </Box>
    </>
  );
};

export default Login;
export type { LoginParams };
