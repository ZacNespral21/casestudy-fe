import React from "react";
import { render } from "react-dom";

import App from "./App";

// Import Custom Styling & Package Styling
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import "react-credit-cards-2/dist/es/styles-compiled.css";

render(<App />, document.getElementById("root"));
