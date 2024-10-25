import IUser from "../Types/User/User";
import IMessage from "./Message/Message";
import IUserSendsMessage, { IPOSTUserSendsMessage } from "./Message/UserSendsMessage";
import IChat from "./Chat";
import IReply from "./Message/Reply";
import IUserReceivesMessage from "./Message/UserReceivesMessage";
import IGroup from "./User/Group";
import IUserJoinsGroup, { IEDITUserJoinsGroup } from "./User/UserJoinsGroup";
import { IMessageRequest } from "./Message/Request";

export type IContactOnline = {

    "online": true;
    "lastOnline"?: undefined;

} | {

    "online": false,
    "lastOnline"?: string

};

export type IMessagePending = {

    "body": IMessage["body"];

};

export interface IMessageSent {

    "id": IUserSendsMessage["id"];
    "userId": IUser["id"]
    "messageId": IMessage["id"]
    "date": IUserSendsMessage["date"];
    "chatType": IChat["type"];
    "chatId": IChat["id"];

};

export interface IMessageToDeliver {

    "id": string;
    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "body": IMessage["body"];
    "senderId": IUserSendsMessage["id"];
    "sendId": IUserSendsMessage["id"];
    "chatId": IChat["id"];
    "chatType": IChat["type"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];
};

export type IMessageToRead = Record<IChat["id"], IUserReceivesMessage["id"][]>;

export type IMessageRead = Record<IUserReceivesMessage["id"], IUserSendsMessage["date"]>;

export type IMessageStatusFromClient = {
    "sends": Record<IUserReceivesMessage["id"], "sent" | "delivered">;
    "receives": Record<IUserSendsMessage["id"], "sent" | "delivered">;
};

export type IMessageStatusFromServer = {
    "sends": Record<IUserSendsMessage["id"], Partial<Pick<IUserSendsMessage, "deliveredDate" | "readDate">>>;
    "receives": Record<IUserReceivesMessage["id"], Pick<IUserReceivesMessage, "date" | "readDate">>;
};

export type IMessageStatusContent = Record<string, Partial<Pick<IUserSendsMessage, "deliveredDate" | "readDate">> | Pick<IUserReceivesMessage, "date" | "readDate">>;

// type RequestStatusCallback = (status: "succeeded" | "failed") => void;
type UserSentMessageCallback = (sent: IMessageSent | undefined) => void;
type UserReceivedMessageCallback = (date: string) => void;
type UserReadMessageCallback = (read: IMessageRead) => void;
type MessageStatusCallback = (sends: IMessageStatusFromServer["sends"], receives: IMessageStatusFromServer["receives"]) => void;

export interface IClientToServerEvents {

    "message-pending": (userSends: IPOSTUserSendsMessage, message: IMessagePending, callback: UserSentMessageCallback) => void;
    // "message-delivered": (deliveredMessage: { id: IUserReceivesMessage["id"], date: IUserReceivedMessage["date"] }, callback: StatusCallback) => void;
    "message-status": (sends: IMessageStatusFromClient["sends"], receives: IMessageStatusFromClient["receives"], callback: MessageStatusCallback) => void;

    "contact-online": (contactId: IUser["id"]) => void;

    "send-data": (sendId: string, callback: (messageId: string) => void) => void;

    "receive-data": (sendId: string, callback: (receive: IUserReceivesMessage) => void) => void;

    "contact-data": (contactId: string, callback: (data: { "name": string, "description": string }) => void) => void;

    "message-content": (messageId: string, callback: (message: { "id": string, "body": string }) => void) => void;

    "sender-id": (sendId: string, callback: (userId: string) => void) => void;

};

export interface IServerToClientEvents {

    "message-to-deliver": (deliver: IMessageToDeliver, callback: UserReceivedMessageCallback) => void;
    "message-to-read": (unread: IMessageToRead, callback: UserReadMessageCallback) => void;
    "message-status": MessageStatusCallback;

    "contact-online": (contactId: IUser["id"], state: IContactOnline) => void;

    "add-contact": (data: { "id": string, "userId": string, "user_name": IUser["name"] }) => void;

    "add-message-request": (data: { "id": IMessageRequest["id"], "userId"?: IMessageRequest["userId"], "contactId"?: IMessageRequest["contactId"], "messageId": IMessageRequest["messageId"] }) => void;

    "drop-message-request": (id: string) => void;

    "add-group-member": (data: { "id": string, "name": string, "admin": boolean }) => void;
    "edit-group-member": (data: Pick<IEDITUserJoinsGroup, "id" | "username" | "admin">) => void;
    "drop-group-member": (memberId: IUserJoinsGroup["id"]) => void;

    "join-group": (data: { "id": string, "name": string, "description"?: string, "admin": boolean }) => void;

};

export interface IInterServerEvents {
};

export interface ISocketData {
};