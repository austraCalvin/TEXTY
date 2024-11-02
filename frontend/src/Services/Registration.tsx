import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPOSTUser } from "../Types/User/User";

export const registrationAPI = createApi({
    "reducerPath": "registrationAPI",
    "baseQuery": fetchBaseQuery({
        "baseUrl": "http://localhost:27018/registration", "credentials": "include", "mode": "cors"
    }),
    "endpoints": (builder) => ({

        "request": builder.mutation<{ "status": "Created" | "Exists" | "Bad Request" | "Internal Server Error" }, string>({
            "query": (email) => ({ "url": `/`, "method": "post", "body": email, "headers": { "Content-Type": "text/plain" } })
        }),
        "check": builder.query<{ "status": "OK" | "Not Found" | "Internal Server Error" }, string>({
            "query": (id) => ({ "url": `/${id}`, "method": "get" })
        }),
        "validate": builder.mutation<{ "status": "Authorized" | "Not Found" | "Unauthorized" | "Bad Request" | "Internal Server Error" }, { "id": string, "code": number }>({
            "query": (registration) => ({ "url": `/${registration.id}`, "method": "post", "body": registration.code, "headers": { "Content-Type": "text/plain" } })
        }),
        "confirm": builder.mutation<{ "status": "Created" | "Not Found" | "Unauthorized" | "Bad Request" | "Internal Server Error", "error"?: { "field"?: keyof IPOSTUser, "message": string } }, Omit<IPOSTUser, "email"> & { "id": string, "code": number }>({
            "query": (registration) => ({ "url": `/confirm/${registration.id}`, "method": "post", "body": { "name": registration.name, "username": registration.username, "password": registration.password, "code": registration.code }, "headers": { "content-type": "application/json" } })
        }),
        "cancel": builder.query<{ "status": "OK" | "Not Found" }, string>({
            "query": (id) => ({ "url": `/cancel/${id}`, "method": "get" })
        }),
        "checkUsername": builder.mutation<({ "status": "OK", "message"?: undefined } | { "status": "Bad Request" | "Internal Server Error", "message": string }), string>({
            "query": (username) => ({ "url": `/username/${username}`, "method": "post", "body": username })
        }),
    })
});

export const { useRequestMutation, useCheckQuery, useValidateMutation, useConfirmMutation, useCancelQuery, useCheckUsernameMutation } = registrationAPI;