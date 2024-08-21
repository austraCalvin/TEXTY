import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import IGroup, { IPOSTEDGroup } from "../Types/User/Group";
import IContact from "../Types/User/UserContactsUser";
import { IChatMember } from "../Types/Chat";
import IUserJoinsGroup from "../Types/User/UserJoinsGroup"

export const groupAPI = createApi({
    "reducerPath": "groupAPI",
    "baseQuery": fetchBaseQuery({ "baseUrl": "http://localhost:27018/group", "credentials": "include", "mode": "cors" }),
    "endpoints": (builder) => ({

        "getAll": builder.query<IGroup[], void>({
            "query": () => ``
        }),
        "createGroup": builder.mutation<IPOSTEDGroup & { "admin": boolean }, { "name": IGroup["name"], "description": IGroup["description"], "invitations": IContact["id"][] }>({
            "query": (group) => ({ "url": `/`, "method": "post", "body": { "name": group.name, "description": group.description, "invitations": group.invitations } })
        }),
        "joinGroup": builder.mutation<IPOSTEDGroup, IGroup["id"]>({
            "query": (groupId) => ({ "url": `/id/${groupId}`, "method": "get", "headers": { "content-type": "text/plain" } })
        }),
        "dropGroup": builder.mutation<IPOSTEDGroup, string>({
            "query": (id) => ({ "url": `/id/${id}`, "method": "delete" })
        }),
        "editGroup": builder.mutation<IPOSTEDGroup, { "id": IGroup["id"], "name": IGroup["name"], "description": IGroup["description"] }>({
            "query": (group) => ({ "url": `/id/${group.name}`, "method": "patch", "body": { "name": group.name, "description": group.description } })
        }),
        "getJoins": builder.query<IUserJoinsGroup[], IGroup["id"]>({
            "query": (groupId) => `/${groupId}`
        })
    })
});

export const { useGetAllQuery, useCreateGroupMutation, useJoinGroupMutation, useDropGroupMutation, useEditGroupMutation, useGetJoinsQuery } = groupAPI;