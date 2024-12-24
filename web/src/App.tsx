import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";

import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", overflow: "scroll" }}
      >
        <AppRoutes />
      </Container>
    </Router>
  );
}

export default App;
