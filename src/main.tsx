import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./routes/Home.tsx";
import Prefs from "./routes/Prefs.tsx";
import Links from "./routes/Links.tsx";

import "./index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/prefs",
      Component: Prefs,
    },
    {
      path: "/links",
      Component: Links,
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

export type Settings = {
  apiKey: string;
  domain: string;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <main className="container mx-auto p-4">
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);
