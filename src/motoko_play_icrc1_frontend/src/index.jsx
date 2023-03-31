import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { defaultProviders } from "@connect2ic/core/providers";
import { createClient } from "@connect2ic/core";
import { Connect2ICProvider } from "@connect2ic/react";
import "react-toastify/dist/ReactToastify.css";

const client = createClient({
  providers: defaultProviders,
});

ReactDOM.render(
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>,
  document.getElementById("root")
);
