import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import { IntlProvider } from "react-intl";
import * as msg_en from "./lang/en.json";
import * as msg_fr from "./lang/fr.json";

const language = navigator.language.split(/[-_]/)[0];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <IntlProvider
      locale={navigator.language}
      messages={language == "fr" ? msg_fr : msg_en}
      defaultLocale="en"
    >
      <Provider store={store}>
        <App />
      </Provider>
    </IntlProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
