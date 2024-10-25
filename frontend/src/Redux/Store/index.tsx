import { combineReducers, PreloadedState } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { reducer as chat } from "../Reducer/Chat";
import { reducer as message } from "../Reducer/Message";
import { reducer as userSendsMessage } from "../Reducer/UserSendsMessage";
import { contactAPI } from "../../Services/Contact";
import { groupAPI } from "../../Services/Group";
import { userSendMessageAPI } from "../../Services/UserSendsMessage";
import { authenticationAPI } from "../../Services/Authentication";
import { registrationAPI } from "../../Services/Registration";
import { recoveryAPI } from "../../Services/Recovery";
import { notificationAPI } from "../../Services/Notification";
import { messageRequestAPI } from "../../Services/MessageRequest";
import { reducer as authentication } from "../Reducer/Authentication";
import { reducer as messageRequest } from "../Reducer/MessageRequest";

const reducer = combineReducers({
    "chat": chat.reducer,
    "message": message.reducer,
    "userSendsMessage": userSendsMessage.reducer,
    "authentication": authentication.reducer,
    "messageRequest": messageRequest.reducer,
    [authenticationAPI.reducerPath]: authenticationAPI.reducer,
    [groupAPI.reducerPath]: groupAPI.reducer,
    [contactAPI.reducerPath]: contactAPI.reducer,
    [userSendMessageAPI.reducerPath]: userSendMessageAPI.reducer,
    [registrationAPI.reducerPath]: registrationAPI.reducer,
    [recoveryAPI.reducerPath]: recoveryAPI.reducer,
    [notificationAPI.reducerPath]: notificationAPI.reducer,
    [messageRequestAPI.reducerPath]: messageRequestAPI.reducer
});

export const setUpStore = (preloadedState: PreloadedState<RootState>) => {

    return configureStore({
        reducer,
        preloadedState,
        middleware: (getDefaultMiddleware) => {

            return getDefaultMiddleware().concat(authenticationAPI.middleware, groupAPI.middleware, contactAPI.middleware, userSendMessageAPI.middleware, registrationAPI.middleware, recoveryAPI.middleware, notificationAPI.middleware, messageRequestAPI.middleware);

        },
    })

};

export type RootState = ReturnType<typeof reducer>;
type Store = ReturnType<typeof setUpStore>;
export type AppDispatch = Store["dispatch"];