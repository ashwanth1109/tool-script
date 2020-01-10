import React from "react";
import ReactDOM from "react-dom";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import App from "./components/App";

const options = {
  timeout: 5000,
  position: positions.MIDDLE
};

const AppWithProvider = () => (
  <Provider template={AlertTemplate} {...options}>
    <App />
  </Provider>
);

ReactDOM.render(<AppWithProvider />, document.getElementById("root"));
