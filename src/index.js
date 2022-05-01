import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UseBeaconProvider } from "./hooks/useBeacon";
import { UseRewardsProvider } from "./hooks/useRewards";
import { UseTabsProvider } from "./hooks/useTabs";

ReactDOM.render(
  <React.StrictMode>
    <UseBeaconProvider>
      <UseRewardsProvider>
        <UseTabsProvider>
          <App />
        </UseTabsProvider>
      </UseRewardsProvider>
    </UseBeaconProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
