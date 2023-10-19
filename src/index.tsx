import { GoogleOAuthProvider } from "@react-oauth/google";
import flatten from "flat";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { initSentry } from "sentry";
import App from "./App";
import "./index.css";
import * as msg_fr from "./lang/fr.json";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";

const language = navigator.language.split(/[-_]/)[0];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

initSentry();

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <IntlProvider
      locale={navigator.language}
      messages={flatten(msg_fr)}
      defaultLocale="fr"
    >
      <Provider store={store}>
        <App />
      </Provider>
    </IntlProvider>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
