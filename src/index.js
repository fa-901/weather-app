import React from "react";
import ReactDOM from "react-dom";

import App from './components/App';
import "./styles/style.scss";

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);