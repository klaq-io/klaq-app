import flatten from "flat";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import * as msg_en from "./lang/en.json";
import * as msg_es from "./lang/es.json";
import * as msg_fr from "./lang/fr.json";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";

const language = navigator.language.split(/[-_]/)[0];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <IntlProvider
      locale={navigator.language}
      messages={flatten(
        language === "fr" ? msg_fr : language === "es" ? msg_es : msg_en
      )}
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
