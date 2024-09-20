import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import IContact, { IContactState, IPOSTEDContact } from "../Types/User/UserContactsUser";
import IUser from "../Types/User/User";

export const contactAPI = createApi({
    "reducerPath": "contactAPI",
    "baseQuery": fetchBaseQuery({ "baseUrl": "http://localhost:27018/contact", "credentials": "include", "mode": "cors" }),
    "endpoints": (builder) => ({

        "getAll": builder.query<IPOSTEDContact[], void>({
            "query": () => ``
        }),
        "getInTouch": builder.query<IContactState, string>({
            "query": (contactId) => `/id/${contactId}`
        }),
        "addContact": builder.mutation<({ "status": "Exists" | "Bad Request" | "Not Found", "message": string, "data"?: undefined }) | { "status": "Created", "data": IPOSTEDContact, "message": undefined }, string>({
            "query": (username) => ({ "url": `/add`, "method": "post", "body": username })
        }),
        "dropContact": builder.mutation<IPOSTEDContact, string>({
            "query": (id) => ({ "url": `/id/${id}`, "method": "delete" })
        }),
        "editContact": builder.mutation<IPOSTEDContact, { "id": IContact["id"], "customname": IContact["name"] }>({
            "query": (data) => ({ "url": `/id/${data.id}`, "method": "patch", "body": data.customname })
        })
    })
});

export const { useGetAllQuery, useAddContactMutation, useDropContactMutation, useEditContactMutation, useGetInTouchQuery } = contactAPI;