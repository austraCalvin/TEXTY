import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import { Routes, Route } from "react-router";
import { BrowserRouter, Navigate } from "react-router-dom"
import Authenticate from "./Components/Auth/Authenticate";
import Welcome from "./Components/Welcome";
import { useAppSelector, useAppDispatch } from "./Redux/Hooks";
import { useCheckAuthQuery } from "./Services/Authentication";
import { clientSocket } from ".";
import { add as addSendMessage, updateOne as editSendMessage } from "./Redux/Reducer/UserSendsMessage";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, MutationDefinition, QueryDefinition } from "@reduxjs/toolkit/query";
import { join as joinGroup, add as addMember } from "./Redux/Reducer/Chat";
import CancelRequest from "./Components/Temp/Cancel";
import Validate from "./Components/Temp/Validate";
import { useCancelQuery as useRegistrationCancelQuery, useValidateMutation as useRegistrationValidateMutation, useCheckQuery as useRegistrationCheckQuery } from "./Services/Registration";
import { useCancelQuery as useRecoveryCancelQuery, useRequestMutation, useValidateMutation as useRecoveryValidateMutation, useCheckQuery as useRecoveryCheckQuery } from "./Services/Recovery";
import { UseMutation, UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import RequestMutation from "./Components/Auth/RequestMutation";
import { IPOSTRecovery } from "./Types/Temp/Recovery";
import NotificationResponse from "./Components/Chats/NotificationResponse";
import CInstallPromoContext from "./Context/InstallPromo";
import { logIn, selectIsAuthenticated } from "./Redux/Reducer/Authentication";

type IRecoveryRequestMutation = UseMutation<MutationDefinition<string | IPOSTRecovery, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, { "status": "Created" | "Exists" | "No User" | "Bad Request" | "Internal Server Error" }, "recoveryAPI" | "registrationAPI">>;

interface IRequestMutationProps {

  "type": "registration" | "recovery";
  useValidateMutation: UseMutation<MutationDefinition<{ "id": string, "code": number }, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, { "status": "OK" | "Authorized" | "Unauthorized" | "Bad Request" | "Not Found" | "Internal Server Error" }, "registrationAPI" | "recoveryAPI">>

};

const App = (): JSX.Element => {

  const { data: isAuth, error: authError, refetch: reCheckAuth, } = useCheckAuthQuery();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [isSocketOnline, setSocketOnline] = React.useState<boolean>(clientSocket.connected);

  const dispatch = useAppDispatch();

  React.useEffect(() => {

    if (authError) {

      const fetchError = authError as FetchBaseQueryError;

      console.log(`AUTHENTICATION FETCH ERROR - STATUS=${fetchError.status}`);

      if (fetchError.status === "PARSING_ERROR") {

        console.log("AUTHENTICATION HAS BEEN REFETCH!");
        reCheckAuth();

      };

      return;

    };

    if (!isAuth) {

      console.log("AUTHENTICATION HAS BEEN REFETCH!");
      reCheckAuth();
      return;

    };

    console.log("AUTHENTICATION SUCEEDED!");
    if (isAuth.state === "Authorized") {

      dispatch(logIn());

    };

  }, [isAuth]);

  React.useEffect(() => {

    console.log("User authentication:", isAuthenticated ? "valid" : "invalid");

    if (!isAuthenticated) {

      return;

    };

    const localPromise: Promise<void> = new Promise((success, danger) => {

      clientSocket.connect();

      //for success
      clientSocket.on("connect", () => {

        success();

      });

      //for catch
      const timeoutID = setTimeout(() => {

        if (clientSocket.connected) {
          return;
        };

        danger("SOCKET failed connecting to the server - timeout");

      }, 5000);

      clientSocket.on("connect_error", (err) => {

        clearTimeout(timeoutID);
        danger(err);

      });

    });

    localPromise.then(() => {

      setSocketOnline(true);

    }).catch((err) => {

      if (!err) {
        return;
      };

      console.log("Error from clientSocket.connect", err);

    });

    return () => { };

  }, [isAuthenticated]);

  React.useEffect(() => {

    if (!isSocketOnline) {

      return;

    };

    console.log("SOCKET ONLINE");

    clientSocket.on("message-to-deliver", (delivery, callback) => {

      console.log("message-to-deliver - triggered -", delivery);

      const deliveredDate = new Date();

      dispatch(addSendMessage({ ...delivery, "date": deliveredDate.toString() }));
      callback(deliveredDate.toUTCString());

    });

    clientSocket.on("message-status", (sends, receives) => {

      console.log("MESSAGE STATUS - triggered");

      const messageStatusContent = { ...sends };

      console.log("MESSAGE STATUS -", messageStatusContent);

      for (const objectId in messageStatusContent) {

        const status = messageStatusContent[objectId] as {
          "chatId": string;
          "date"?: string;
          "deliveredDate"?: string;
          "readDate"?: string;
        };

        dispatch(editSendMessage({ "id": objectId, "changes": { "deliveredDate": status.deliveredDate } }));

      };

    });

    clientSocket.on("join-group", (data) => {

      console.log(`JOIN GROUP -`, { "id": data.id, "type": "group", "name": data.name, "description": "hello world", "chatId": data.id, "admin": data.admin });

      dispatch(joinGroup({ "id": data.id, "type": "group", "name": data.name, "description": "hello world", "chatId": data.id, "admin": data.admin }));

    });

    clientSocket.on("add-group-member", (data) => {

      console.log(`ADD MEMBER -`, { "id": data.id, "name": data.name, "description": "hello world", "chatId": data.id, "admin": data.admin });

      dispatch(addMember({ "id": data.id, "name": data.name, "description": "hello world", "chatId": data.id, "admin": data.admin }));

    });

    return () => { };

  }, [isSocketOnline]);

  type CancelQuery = UseQuery<QueryDefinition<string, BaseQueryFn<string | FetchArgs, {}, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, { "status": "Success" | "Fail" }>>;

  const conditionalRoutes = React.useMemo(() => (<>

    <Route path="/registration/confirm/:id" element={<Validate type={"registration"} useValidateMutation={useRegistrationValidateMutation as IRequestMutationProps["useValidateMutation"]} useCheckQuery={useRegistrationCheckQuery} />} />

    <Route path="/registration/cancel/:id" element={<CancelRequest type={"registration"} useCancelQuery={useRegistrationCancelQuery as CancelQuery} />} />

    <Route path="/recovery/confirm/:id" element={<Validate type={"recovery"} useValidateMutation={useRecoveryValidateMutation as IRequestMutationProps["useValidateMutation"]} useCheckQuery={useRecoveryCheckQuery} />} />

    <Route path="/recovery/cancel/:id" element={<CancelRequest type={"recovery"} useCancelQuery={useRecoveryCancelQuery as CancelQuery} />} />

    <Route path="/forgotPassword" element={<RequestMutation type={"recovery"} useRequestMutation={useRequestMutation as IRecoveryRequestMutation} />} />

    <Route path="/chat/:id" element={<NotificationResponse />} />

    {
      isAuthenticated
        ?
        <>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Navigate to="/" />} />
          {/* <Route path="/user/:userId/message/:messageId/reply" element={<NotificationResponse />} /> */}
        </>
        :
        <>
          <Route path="/login" element={<Authenticate />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
    }

  </>), [isAuthenticated]);

  return (<>

    <CInstallPromoContext>
      <BrowserRouter basename="/">

        <Routes>
          {conditionalRoutes}
        </Routes>

        {
          !isAuth && authError
            ?
            <h3 className="text-center">BACKEND AUTHENTICATION ERROR</h3>
            :
            <></>
        }

      </BrowserRouter>

    </CInstallPromoContext>

  </>);

};

export default App;