import React from "react";
import ReactDOM from "react-dom";

import App from './components/App';
import ErrorBoundary from './components/ErrorBoundary';
import "./assets/styles/style.scss";
import dotenv from "dotenv";

dotenv.config();


var mountNode = document.getElementById("app");
ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, mountNode);