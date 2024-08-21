import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import IContact, { IContactState, IPOSTEDContact } from "../Types/User/UserContactsUser";

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
        "addContact": builder.mutation<IPOSTEDContact, { "user": IContact["name"] }>({
            "query": (name) => ({ "url": `/username/${name.user}`, "method": "post" })
        }),
        "dropContact": builder.mutation<IPOSTEDContact, string>({
            "query": (id) => ({ "url": `/id/${id}`, "method": "delete" })
        }),
        "editContact": builder.mutation<IPOSTEDContact, {"id": IContact["id"], "customname": IContact["name"]}>({
            "query": (data) => ({ "url": `/id/${data.id}`, "method": "patch", "body": data.customname })
        })
    })
});

export const { useGetAllQuery, useAddContactMutation, useDropContactMutation, useEditContactMutation, useGetInTouchQuery } = contactAPI;