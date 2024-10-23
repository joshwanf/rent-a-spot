import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { Modal, ModalProvider } from "./context/Modal";
import App from "./App";
import "./index.css";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import configureStore from "./store";
import * as sessionActions from "./store/session";

const store = configureStore();

// @ts-expect-error aA crap
if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  // @ts-expect-error aA crap
  window.csrfFetch = csrfFetch;
  // @ts-expect-error aA crap
  window.store = store;
  // @ts-expect-error aA crap
  window.sessionActions = sessionActions;
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ModalProvider>
        <Provider store={store}>
          <App />
          <Modal />
        </Provider>
      </ModalProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}
