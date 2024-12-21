import React from 'react';
import { useRoutes } from 'react-router-dom';
import TextEditor from './components/TextEditor';

const AppRoutes = () => {
  const routes = [
    { path: '/', element: <h1>login</h1> },
    { path: '/editor/:documentId', element: <TextEditor /> },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
