import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type INotificationFetchResponse = "Success" | "Fail" | "Internal Server Error";

type IEnableNotification = { "push": false, "email"?: undefined, "pushSubscription"?: undefined } | { "push": true, "email"?: undefined, "pushSubscription": PushSubscription } | { "push"?: undefined, "email": boolean, "pushSubscription"?: undefined };

export const notificationAPI = createApi({
    "reducerPath": "notificationAPI",
    "baseQuery": fetchBaseQuery({
        "baseUrl": "http://localhost:27018/notification", "credentials": "include", "mode": "cors"
    }),
    "endpoints": (builder) => ({

        "isEnabled": builder.query<{ "notify": boolean, "push": boolean, "email": boolean }, void>({
            "query": () => ({ "url": "/", "method": "get", "responseHandler": "json" })
        }),
        "switchNotify": builder.mutation<{ "state": INotificationFetchResponse }, boolean>({
            "query": (val) => ({ "url": `/switch/${val ? "on" : "off"}`, "method": "get", "responseHandler": "json" })
        }),
        // "subscribe": builder.mutation<{ "state": INotificationFetchResponse }, PushSubscriptionJSON>({
        //     "query": (val) => ({ "url": `/webpush`, "method": "post", "body": val, "headers": { "Content-Type": "text/plain" } })
        // }),
        // "unsubscribe": builder.mutation<{ "state": INotificationFetchResponse }, string>({
        //     "query": (email) => ({ "url": `/webpush`, "method": "delete" })
        // }),
        "enable": builder.mutation<{ "state": INotificationFetchResponse }, IEnableNotification>({
            "query": (val) => ({ "url": `/`, "method": "post", "body": val, "headers": { "Content-Type": "application/json" }, "responseHandler": "json" })
        }),

    })
});

export const { useIsEnabledQuery, useSwitchNotifyMutation, useEnableMutation } = notificationAPI;