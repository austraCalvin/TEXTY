import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IMessageRequest } from "../Types/Message/Request";
import { IPOSTEDContact } from "../Types/User/UserContactsUser";

type IMessageRequestFetchServerResponse = { "status": "Internal Server Error" };
type IMessageRequestFetchResponse = IMessageRequest[] | IMessageRequestFetchServerResponse;

export const messageRequestAPI = createApi({
    "reducerPath": "messageRequestAPI",
    "baseQuery": fetchBaseQuery({
        "baseUrl": "http://localhost:27018/messagerequest", "credentials": "include", "mode": "cors"
    }),
    "endpoints": (builder) => ({

        "getAll": builder.query<IMessageRequestFetchResponse, void>({
            "query": () => ({ "url": "/", "method": "get", "responseHandler": "json" })
        }),
        "accept": builder.mutation<({ "status": "Internal Server Error" | "Not Found" | "Fail", "data"?: undefined, "message": string }) | { "status": "Success", "data": IPOSTEDContact, "message"?: undefined }, string>({
            "query": (username) => ({ "url": `/accept`, "method": "post", "body": username })
        }),
        "decline": builder.mutation<({ "status": "Success", "message"?: undefined } | { "status": "Fail" | "Internal Server Error", "message": string }), string>({
            "query": (username) => ({ "url": `/decline`, "method": "post", "body": username })
        }),
    })
});

export const { useGetAllQuery, useAcceptMutation, useDeclineMutation } = messageRequestAPI;