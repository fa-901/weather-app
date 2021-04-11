import React from "react";
import ReactDOM from "react-dom";

import App from './components/App';
import ErrorBoundary from './components/ErrorBoundary';
import "./styles/style.scss";

var mountNode = document.getElementById("app");
ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, mountNode);