import App from "./components/App";
import * as React from "react";
import { render } from "react-dom";

const container: HTMLElement | null = document.getElementById("app");
render(<App />, container);
