import { createEntityAdapter, createSlice, EntityId, PayloadAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import IRefUserSendsMessage, { IUserSendsMessage, IUserSentMessage } from "../../Types/Message/UserSendsMessage";
import IUserReceivesMessage from "../../Types/Message/UserReceivesMessage";
import IChat from "../../Types/Chat";
import IReply from "../../Types/Message/Reply";
import IUser from "../../Types/User/User";
import IMessage from "../../Types/Message/Message";

interface ILocalUserSendsMessage extends Omit<IUserSendsMessage, "id" | "userId"> {
    "userId"?: string;
};

type ILocalUserReceivesMessage = Omit<IUserReceivesMessage, "id">

interface IUserSMS {
    "id": IRefUserSendsMessage["id"];
    "userId"?: IUser["id"];
    "messageId": IMessage["id"];
    "senderId"?: IUser["id"];
    "sendId"?: IRefUserSendsMessage["id"];
    "date": IRefUserSendsMessage["date"];
    "deliveredDate"?: IRefUserSendsMessage["deliveredDate"];
    "readDate"?: IRefUserSendsMessage["readDate"];
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];
    "sent"?: boolean;
};


interface IUserSendMessageEntity {

    "ids": EntityId[];
    "entities": Record<string, IUserSMS | undefined>;

};

const entity = createEntityAdapter<IUserSMS>({
    "selectId": (model) => model.id,
    "sortComparer": (a, b) => {

        const first = `${new Date(a.date).getTime()}`;
        const second = `${new Date(b.date).getTime()}`;

        return first.localeCompare(second);

    }
});

const initialState = {

    ...entity.getInitialState(),


} satisfies IUserSendMessageEntity as IUserSendMessageEntity;

type IMessageSent = {
    "id": string,
    "previousId": string,
    "messageId": string,
    "userId": string
};

type IAddMessage = {
    "id"?: string;
    "userId"?: IUser["id"];
    "messageId": IMessage["id"];
    "senderId"?: IUser["id"];
    "sendId"?: IRefUserSendsMessage["id"];
    "date": IRefUserSendsMessage["date"];
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "deliveredDate"?: IRefUserSendsMessage["deliveredDate"];
    "readDate"?: IRefUserSendsMessage["readDate"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];
}

export const reducer = createSlice({
    "name": "userSendsMessage",
    initialState,
    "reducers": {

        "sent": (state, action: PayloadAction<IMessageSent>) => {

            if (!(state.ids.includes(action.payload.previousId))) {

                return state;

            };

            console.log("kingsman -", {
                "previousId": action.payload.previousId,
                "id": action.payload.id,
                "userId": action.payload.userId,
                "messageId": action.payload.messageId,
                "sent": true
            });

            entity.updateOne(state, { "id": action.payload.previousId, "changes": { "id": action.payload.id, "userId": action.payload.userId, "messageId": action.payload.messageId, "sent": true } });

        },
        "add": (state, action: PayloadAction<IAddMessage>) => {

            let smsId: string;

            if (action.payload.sendId) {

                smsId = action.payload.date;

            } else {

                smsId = action.payload.id as string;

            };

            entity.addOne(state, { "id": smsId, ...action.payload, "sent": false });

        },
        "remove": entity.removeOne,
        "setMany": (state, action: PayloadAction<IUserSMS | IUserSMS[]>) => {

            if (Object.prototype.toString.call(action.payload) === "[object Array]") {

                return entity.setMany(state, action.payload as IUserSMS[]);

            } else if (Object.prototype.toString.call(action.payload) === "[object Object]") {

                return entity.setOne(state, action.payload as IUserSMS)

            } else {

                return state;

            };

        },
        "updateOne": entity.updateOne

    },

});

export const selectSMSById = (state: RootState, id: string) => {

    const data = state.userSendsMessage;

    if (!data) {

        return null;

    };

    const currentId = data.ids.findIndex((each) => {

        return each === id;

    });

    if (currentId === -1) {

        return null;

    };

    return data.entities[id] as IUserSMS;

};

export const selectAllMessagesByChat = (state: RootState, chatId: string) => {

    const data = state.userSendsMessage;

    let chatsms: IUserSMS[] = [];

    for (const smsId of data.ids) {

        const element = data.entities[smsId] as IUserSMS;

        if (chatId === element.chatId) {

            chatsms.push(element);

        };

    };

    return chatsms;

};

export const { add, remove, sent, setMany, updateOne } = reducer.actions;












/*


import { createEntityAdapter, createSlice, EntityId, PayloadAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import IRefUserSendsMessage, { IUserSendsMessage, IUserSentMessage } from "../../Types/Message/UserSendsMessage";
import IUserReceivesMessage from "../../Types/Message/UserReceivesMessage";

interface ILocalUserSendsMessage extends Omit<IUserSendsMessage, "userId"> {
    "id": string;
    "userId"?: string;
};

type chatEntity = {

    "ids": EntityId[];
    "entities": Record<string, ILocalUserSendsMessage | IUserReceivesMessage | undefined>;

};

interface IUserSendMessageEntity {

    chats: Record<string, chatEntity | undefined>,

};

const initialState = {

    "chats": {}

} as IUserSendMessageEntity;

export const reducer = createSlice({
    "name": "userSendsMessage",
    initialState,
    "reducers": {

        "sent": (state, action: PayloadAction<{ "chatId": string, "id": string, "previousId": string, "messageId": string, "userId": string }>) => {

            if (!(state.chats[action.payload.chatId])) {

                return state;

            };

            const currentEntities = state.chats[action.payload.chatId] as chatEntity;

            const index = currentEntities.ids.findIndex((id) => {

                return id === action.payload.previousId;

            });

            if (index === -1) {

                return state;

            };

            const found = currentEntities.entities[action.payload.previousId] as ILocalUserSendsMessage;

            currentEntities.ids[index] = action.payload.id;

            currentEntities.entities[action.payload.id] = { ...found, "id": action.payload.id, "messageId": action.payload.messageId, "sent": true };

            delete currentEntities.entities[action.payload.previousId];

        },
        "add": (state, action: PayloadAction<(Omit<IUserSendsMessage, "userId">) | IUserReceivesMessage>) => {

            if (!(state.chats[action.payload.chatId])) {

                state.chats[action.payload.chatId] = {
                    "ids": [],
                    "entities": {}
                };

            };

            const currentChat = state.chats[action.payload.chatId] as chatEntity;

            const payloadVal = action.payload;

            if ((payloadVal as IUserReceivesMessage).sendId) {

                const receiveObj = payloadVal as IUserReceivesMessage;

                currentChat.ids.push(receiveObj.id);
                currentChat.entities[receiveObj.id] = receiveObj;

            } else {

                let id: string = payloadVal.date;

                if (payloadVal.id) {

                    id = payloadVal.id;

                };

                currentChat.ids.push(id);
                currentChat.entities[id] = { "id": payloadVal.date, ...payloadVal };

            };

            console.log("addOne - SEND-MESSAGE HAD BEEN ADDED", currentChat.entities);

        },
        "remove": (state, action: PayloadAction<{ "chatId": string, "id": string }>) => {

            if (!(state.chats[action.payload.chatId])) {

                return state;

            };

            const currentChat = state.chats[action.payload.chatId] as chatEntity;

            const index = currentChat.ids.findIndex((id) => {

                return id === action.payload.id;

            });

            delete currentChat.ids[index];
            delete currentChat.entities[action.payload.id];

        },
        "setAllByChat": (state, action: PayloadAction<{ "chatId": string, "mssg": (IUserSentMessage | IUserReceivesMessage)[] }>) => {

            if (!(state.chats[action.payload.chatId])) {

                state.chats[action.payload.chatId] = { "ids": [], "entities": {} };

            };

            const currentState = state.chats[action.payload.chatId] as chatEntity;

            if (currentState) {

                action.payload.mssg.forEach((e) => {

                    currentState.ids.push(e.id);
                    currentState.entities[e.id] = { ...e, "date": new Date(e.date).getTime().toString() };

                });

            };

            console.log("setAllByChat - SEND-MESSAGE HAS BEEN ADDED", currentState.entities);

        },
        "edit": (state, action: PayloadAction<{ "chatId": string, "id": string, "changes": Partial<{ "date": string, "deliveredDate": string, "readDate": string, "senderId": string }> }>) => {

            if (!(state.chats[action.payload.chatId])) {

                console.log("CHAT IS EMPTY -", action.payload.chatId);
                return state;

            };

            const currentEntities = state.chats[action.payload.chatId] as chatEntity;

            console.log("CURRENT-ENTITIES", currentEntities ? "exist" : "ghost");

            const index = currentEntities.ids.findIndex((id) => {

                console.log("CURRENT-ENTITY - id =", id, "$$", "searchId =", action.payload.id);
                return id === action.payload.id;

            });

            console.log("CURRENT-ENTITY - FOUND -", index);

            if (index === -1) {

                return state;

            };

            const found = currentEntities.entities[action.payload.id] as { "sendId"?: string };

            if (found.sendId) {

                (found as IUserReceivesMessage).senderId = action.payload.changes.senderId;

            } else {

                console.log("INSPECTION -", new Date(action.payload.changes.deliveredDate as string).getTime().toString());

                (found as ILocalUserSendsMessage).deliveredDate = new Date(action.payload.changes.deliveredDate as string).getTime().toString();

            };

            // for (let prop in action.payload.changes) {

            //     const property = prop as ("date" | "deliveredDate" | "readDate");

            //     found[property] = new Date(action.payload.changes[property] as string).getTime().toString();

            // };

        },
        "receive": (state, action: PayloadAction<{ "id": string, "chatId": string, "changes": { "messageId": string } }>) => {

            if (!(state.chats[action.payload.chatId])) {

                return state;

            };

            const currentEntities = state.chats[action.payload.chatId] as chatEntity;

            const index = currentEntities.ids.findIndex((id) => {

                return id === action.payload.id;

            });

            if (index === -1) {

                return state;

            };

            const found = currentEntities.entities[action.payload.id] as IUserReceivesMessage;

            found.messageId = action.payload.changes.messageId;

        }

    },

});

export const selectSendMessageById = (state: RootState, chatId: string, id: string) => {

    const data = state.userSendsMessage.chats[chatId];

    if (!data) {

        return false;

    };

    const elementId = data.ids.findIndex((each) => {

        return each === id;

    });

    if (elementId === -1) {

        return false;

    };

    return data.entities[id] as (ILocalUserSendsMessage | IUserReceivesMessage);

};

export const selectAllMessagesByChat = (state: RootState, chatId: string) => {

    const data = state.userSendsMessage.chats[chatId];

    if (!data || !data.ids[0]) {

        return [] as (ILocalUserSendsMessage | IUserReceivesMessage)[];

    };

    return Object.values(data.entities) as (ILocalUserSendsMessage | IUserReceivesMessage)[];

};

export const { add, remove, sent, setAllByChat, edit, receive } = reducer.actions;



*/