import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ILoginUser } from "../Types/User/User";

export const authenticationAPI = createApi({
    "reducerPath": "authenticationAPI",
    "baseQuery": fetchBaseQuery({
        "baseUrl": "http://localhost:27018", "credentials": "include", "mode": "cors"
    }),
    "endpoints": (builder) => ({

        "checkAuth": builder.query<{ "state": ("Unauthorized" | "Authorized") }, void>({
            "query": () => ({ "url": "/isAuthenticated", "method": "GET" })
        }),
        "LogIn": builder.mutation<"Correct" | "Incorrect" | "Fail", ILoginUser>({
            "query": (data) => ({ "url": "/login", "method": "POST", "body": data, responseHandler: "text", "headers": {"content-type": "application/json"} })
        }),
        "LogOut": builder.mutation<{ "state": ("Success" | "Fail") }, void>({
            "query": () => ({ "url": "/logout", "method": "POST", "body": "", responseHandler: "json" })
        })

    })
});

export const { useCheckAuthQuery, useLogInMutation, useLogOutMutation } = authenticationAPI;