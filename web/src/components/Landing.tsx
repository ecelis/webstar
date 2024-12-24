import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Logout from "./Logout";
import SignInContainer from "./SignInContainer";
import Card from "./Card";
import Divider from "@mui/material/Divider";
const getData = (field: string): string | null => {
  const data = sessionStorage.getItem("wsauth");
  if (!data) return null;
  return JSON.parse(data)[field];
};

const Landing = () => {
  const [auth, setAuth] = useState(sessionStorage.getItem("wsauth"));

  return auth ? (
    <>
      <h1>Hola, {getData("username")}!</h1>
      <Logout setAuth={setAuth} />
    </>
  ) : (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Login setAuth={setAuth} />
        <Divider>or</Divider>
        <Register setAuth={setAuth} />
      </Card>
    </SignInContainer>
  );
};

export default Landing;
