import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { setUpStore } from "./Redux/Store";
import { setupListeners } from "@reduxjs/toolkit/query";
import 'bootstrap/dist/css/bootstrap.min.css';
import io, { Socket } from "socket.io-client";
import { IServerToClientEvents, IClientToServerEvents } from "./Types/SocketEvents";
// import { ApolloProvider, GraphQLRequest, ApolloClient, InMemoryCache, gql } from "@apollo/client";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

export const clientSocket: Socket<IServerToClientEvents, IClientToServerEvents> = io("ws://localhost:27018", { "withCredentials": true }).disconnect();

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);

const store = setUpStore({});
setupListeners(store.dispatch);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  "onSuccess": (registration) => {

    console.log(`SERVICE WORKER ON SUCCESS - scope=${registration.scope}`);

  },
  "onUpdate": (registration) => {

    console.log(`SERVICE WORKER ON UPDATE - scope=${registration.scope}`);

  }
});