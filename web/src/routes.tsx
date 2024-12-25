import { useRoutes } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import Landing from "./components/Landing";

const AppRoutes = () => {
  const routes = [
    { path: "/", element: <Landing /> },
    { path: "/document/:documentId", element: <TextEditor /> },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
