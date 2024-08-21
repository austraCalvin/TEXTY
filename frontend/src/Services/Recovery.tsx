import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPOSTUser } from "../Types/User/User";
import { IPOSTRecovery } from "../Types/Temp/Recovery";

export const recoveryAPI = createApi({
    "reducerPath": "recoveryAPI",
    "baseQuery": fetchBaseQuery({
        "baseUrl": "http://localhost:27018/recovery", "credentials": "include", "mode": "cors"
    }),
    "endpoints": (builder) => ({

        "request": builder.mutation<{ "status": "Created" | "No User" | "Bad Request" | "Internal Server Error" }, IPOSTRecovery>({
            "query": (data) => ({ "url": `/`, "method": "post", "body": data, "headers": { "Content-Type": "application/json" } })
        }),
        "check": builder.query<{ "status": "OK" | "Not Found" | "Internal Server Error" }, string>({
            "query": (id) => ({ "url": `/${id}`, "method": "get" })
        }),
        "validate": builder.mutation<{ "status": "Authorized" | "Not Found" | "Unauthorized" | "Bad Request" | "Internal Server Error" }, { "id": string, "code": number }>({
            "query": (data) => ({ "url": `/${data.id}`, "method": "post", "body": data.code, "headers": { "Content-Type": "text/plain" } })
        }),
        "confirm": builder.mutation<{ "status": "Patched" | "Not Found" | "Unauthorized" | "Bad Request" | "Internal Server Error" }, Partial<IPOSTUser> & { "id": string, "code": number }>({
            "query": (recovery) => ({ "url": `/confirm/${recovery.id}`, "method": "post", "body": recovery, "headers": { "content-type": "application/json" } })
        }),
        "cancel": builder.query<{ "status": "OK" | "Not Found" }, string>({
            "query": (id) => ({ "url": `/cancel/${id}`, "method": "get" })
        })

    })
});

export const { useRequestMutation, useCheckQuery, useValidateMutation, useConfirmMutation, useCancelQuery } = recoveryAPI;