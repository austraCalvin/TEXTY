import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import IUserReceivesMessage from "../Types/Message/UserReceivesMessage";
import { IUserSentMessage } from "../Types/Message/UserSendsMessage";

export const userSendMessageAPI = createApi({
    "reducerPath": "userSendsMessageAPI",
    "baseQuery": fetchBaseQuery({ "baseUrl": "http://localhost:27018", "credentials": "include", "mode": "cors" }),
    "endpoints": (builder) => ({

        "getAllMessages": builder.query<(IUserSentMessage|IUserReceivesMessage)[], string>({
            "query": (chatId) => `/backup/chat/${chatId}`
        })
        
    })
});

export const { useGetAllMessagesQuery } = userSendMessageAPI;