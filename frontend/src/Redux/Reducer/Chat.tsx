import { createEntityAdapter, createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import IContact from "../../Types/User/UserContactsUser";
import IChat from "../../Types/Chat";
import { CurrentChatOptional } from "../../Types/Chat";

interface IContactEntity {

    ids: EntityId[];
    entities: Record<IContact["id"], IChat | undefined>,
    current?: CurrentChatOptional

};

const entity = createEntityAdapter<IChat>({
    "selectId": (model) => {
        return model.userId ? model.userId : model.id;
    },
    "sortComparer": (a, b) => a.name.localeCompare(b.name)
});

const initialState = {

    ...entity.getInitialState(),


} satisfies IContactEntity as IContactEntity;

export const reducer = createSlice({
    "name": "contact",
    initialState,
    "reducers": {

        "setAll": entity.setAll,
        "untouch": (state) => {

            if (state.current) {

                delete state.current;

            };

        },
        "touch": (state, action: PayloadAction<IChat["id"]>) => {

            state.current = { "id": action.payload };
            return state;

        },
        "intouch": (state, action: PayloadAction<{ "online": true, "lastOnline"?: undefined } | { "online": false, "lastOnline"?: string }>) => {

            if (!state.current) {

                return state;

            };

            if (!action.payload.online) {

                state.current = { ...state.current, ...action.payload };
                return state;

            };

            state.current = { ...state.current, ...action.payload };
            delete state.current.lastOnline;

            return;

        },
        "add": (state, action: PayloadAction<{ "id": string, "chatId": string, "name": string, "description": string, "admin": boolean }>) => {

            if (!state.ids.includes(action.payload.chatId)) {

                return state;

            };

            const currentChat = state.entities[action.payload.chatId] as IChat;

            currentChat.members.push({
                "id": action.payload.id,
                "name": action.payload.name,
                "description": action.payload.description,
                "admin": action.payload.admin
            });

        },
        "join": (state, action: PayloadAction<{ "id": string, "type": "contact", "name": string, "description": string, "chatId": string } | { "id": string, "type": "group", "name": string, "description": string, "chatId": string, "admin": boolean }>) => {

            if (state.ids.includes(action.payload.chatId)) {

                return;

            };

            state.ids.push(action.payload.chatId);

            const postChat: IChat = {
                "id": action.payload.id,
                "type": action.payload.type,
                "name": action.payload.name,
                "description": action.payload.description,
                "members":
                    action.payload.type === "contact"
                        ?
                        [
                            {
                                "id": action.payload.id,
                                "name": action.payload.name,
                                "description": action.payload.description
                            }
                        ]
                        :
                        []
            };

            if (action.payload.type === "group") {

                postChat.admin = action.payload.admin;

            };

            state.entities[action.payload.chatId] = postChat;

            return state;

        },
        "remove": (state, action: PayloadAction<{ "id": string, "name": string, "description": string, "chatId": string }>) => {

            if (!state.ids.includes(action.payload.chatId)) {

                return state;

            };

            const currentChat = state.entities[action.payload.chatId] as IChat;

            const foundIndex = currentChat.members.findIndex((val) => val.id === action.payload.id);

            currentChat.members.splice(foundIndex, 1);

        },
        "edit": (state, action: PayloadAction<{ "id": string, "chatId": string, "changes": { "name"?: string, "description"?: string } }>) => {

            if (!state.ids.includes(action.payload.chatId)) {

                return state;

            };

            const currentChat = state.entities[action.payload.chatId] as IChat;

            const foundElement = currentChat.members.find((val) => val.id === action.payload.id);

            if (!foundElement) {

                return state;

            };

            foundElement.name = action.payload.changes.name ? action.payload.changes.name : foundElement.name;
            foundElement.description = action.payload.changes.description ? action.payload.changes.description : foundElement.description;

        }

    },

});

export const selectContactById = (state: RootState, id: IContact["id"]) => {

    const elementId = state.chat.ids.findIndex((each) => {

        return each === id;

    });

    if (elementId === -1) {

        return null;

    };

    // for (const currentId of state.chat.ids) {

    //     const currentElement = state.chat.entities[currentId] as IChat;

    //     if (currentElement.userId === id) {

    //         return currentElement;

    //     };

    // };

    return state.chat.entities[id] as IChat;

};


export const selectContactByUserId = (state: RootState, userId: IContact["id"]) => {

    const elementId = state.chat.ids.findIndex((each) => {

        return each === userId;

    });

    if (elementId === -1) {

        return null;

    };

    const currentChat = state.chat.entities[userId] as IChat;

    return currentChat.type === "contact" ? currentChat : null;

    // for (const contactId of state.chat.ids) {

    //     const currentContact = state.chat.entities[contactId] as IChat;

    //     if (currentContact.type === "contact") {

    //         if (currentContact.userId === userId) {

    //             return currentContact

    //         };

    //     };


    // };

    // return null;

};

export const selectAllMembers = (state: RootState, chatId: string) => {

    if (!state.chat.ids.includes(chatId)) {

        return;

    };

    const currentChat = (state.chat.entities[chatId] as IChat);

    return currentChat.members;

};

export const selectAllContacts = (state: RootState) => {

    return state.chat.entities;

};

export const selectAllContactIds = (state: RootState) => {

    return state.chat.ids;

};

export const selectCurrentContact = (state: RootState) => {

    return state.chat.current ? state.chat.current : null;

};

export const selectCurrentContactId = (state: RootState) => {

    return state.chat.current ? state.chat.current.id : null;

};

export const selectCurrentChatMember = (state: RootState, chatId: string, senderId: string) => {

    const currentChat = state.chat.entities[chatId];

    if (!currentChat) {

        return null;

    };

    const foundElement = currentChat.members.find((val) => val.id === senderId);

    return foundElement ? foundElement : null;

};

export const { add, join, remove, edit, touch, intouch, untouch, setAll } = reducer.actions;