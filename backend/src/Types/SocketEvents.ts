import IUser from "../Types/User/User";
import { IMessagePending } from "./Message/Message";
// import { IDAOReply } from "./Message/Reply";
import { IMessageSent, IPOSTUserSendsMessage, IUserSendsMessage } from "./Message/UserSendsMessage";
import IChat from "./Chat";
import IUserReceivesMessage, { IMessageToDeliver } from "./Message/UserReceivesMessage";
import IUserJoinsGroup, { IEDITUserJoinsGroup } from "./User/UserJoinsGroup";
import DBDate from "./DBDate";
import IUserContactsUser from "./User/UserContactsUser";
import { IMessageRequest } from "./Message/Request";

export type IContactOnline = {

    "online": true;
    "lastOnline"?: undefined;

} | {

    "online": false,
    "lastOnline"?: DBDate

};

export type IMessageToRead = Record<IChat["id"], IUserReceivesMessage["id"][]>;

export type IMessageRead = Record<IUserReceivesMessage["id"], IUserSendsMessage["date"]>;

export type IMessageStatusFromClient = {
    "sends": Record<IUserReceivesMessage["id"], "sent" | "delivered">;
    "receives": Record<IUserSendsMessage["id"], "sent" | "delivered">;
};

export type IMessageStatusFromServer = {
    "sends": Record<IUserSendsMessage["id"], Partial<Pick<IUserSendsMessage, "deliveredDate" | "readDate" | "chatId">>>;
    "receives": Record<IUserReceivesMessage["id"], (Pick<IUserReceivesMessage, "date" | "readDate" | "chatId">) & { "userId"?: string }>;
};

// export type IMessageFetch = IFile["id"];

// type RequestStatusCallback = (status: "succeeded" | "failed") => void;
type UserSentMessageCallback = (sent: IMessageSent | undefined) => void;
type UserReceivedMessageCallback = (date: IUserSendsMessage["date"]) => void;
type UserReadMessageCallback = (read: IMessageRead) => void;
type MessageStatusCallback = (sends: IMessageStatusFromServer["sends"], receives: IMessageStatusFromServer["receives"]) => void;

export interface IClientToServerEvents {
    "message-pending": (userSends: Omit<IPOSTUserSendsMessage, "userId">, message: IMessagePending, callback: UserSentMessageCallback) => void;
    // "message-delivered": (deliveredMessage: { id: IUserReceivesMessage["id"], date: IUserReceivedMessage["date"] }, callback: StatusCallback) => void;
    "message-status": (sends: IMessageStatusFromClient["sends"], receives: IMessageStatusFromClient["receives"], callback: MessageStatusCallback) => void;

    "contact-online": (contactId: IUser["id"]) => void;

    "send-data": (sendId: string, callback: (messageId: string) => void) => void;

    "contact-data": (contactId: string, callback: (data: { "name": string, "description": string }) => void) => void;

    "message-content": (messageId: string, callback: (message: { "id": string, "body": string }) => void) => void;

    "sender-id": (sendId: string, callback: (userId: string) => void) => void;

};

export interface IServerToClientEvents {

    "message-to-deliver": (deliver: IMessageToDeliver, callback: UserReceivedMessageCallback) => void;
    "message-to-read": (unread: IMessageToRead, callback: UserReadMessageCallback) => void;
    "message-status": MessageStatusCallback;

    "contact-online": (contactId: IUser["id"], state: IContactOnline) => void;

    // "contact-online": (contactId: IUser["id"]) => void;
    // "contact-offline": (contactId: IUser["id"], lastOnline?: DBDate) => void;

    "add-contact": (data: { "id": IUserContactsUser["id"], "userId": string, "user_name": IUser["name"] }) => void;

    "add-message-request": (data: { "id": IMessageRequest["id"], "userId"?: IMessageRequest["userId"], "contactId"?: IMessageRequest["contactId"], "messageId": IMessageRequest["messageId"] }) => void;

    "drop-message-request": (id: string) => void;

    "add-group-member": (data: { "id": string, "name": string, "admin": boolean }) => void;
    "edit-group-member": (data: Pick<IEDITUserJoinsGroup, "id" | "admin">) => void;
    "drop-group-member": (memberId: IUserJoinsGroup["id"]) => void;

    "join-group": (data: { "id": string, "name": string, "admin": boolean }) => void;

};

export interface IInterServerEvents {
};

export interface ISocketData {
};

/*

export interface IClientToServerEvents {
NOT YET
"add-friend": (data: IPOSTUserContactsUser, callback: RequestStatusCallback) => void;
"remove-friend": (id: IUserContactsUser["id"], callback: RequestStatusCallback) => void;
"edit-friend": (data: IEDITUserContactsUser, callback: RequestStatusCallback) => void;
"remove-group": (id: IGroup["id"], callback: RequestStatusCallback) => void;
"edit-group": (data: IEDITGroup, callback: RequestStatusCallback) => void;

"quit-group": (id: IUserJoinsGroup["id"], callback: RequestStatusCallback) => void;
"edit-join-group": (data: IEDITUserJoinsGroup, callback: RequestStatusCallback) => void;
}

*/



/*

message pending --- from client
when user reconnected event triggers and
sends message over and over again
message (id || body) and files optional*
(userId, date, chatType, chatId, replyType, replyId)

message sent --- from server
until the message is delivered to the server
the user-sends-message object is posted to the se|rver
it goes back to the client by its id (userId, chatType, chatId, date)
(id, userId, messageId, date, chatType, chatId)

message-to-deliver --- from server
when chatId participants reconnected event triggers and
sends the message to deliver by the user over and over again
(userId, message(id, body), senderId, chat(id, type), fileIds, reply(id, type))

message delivered --- from client
until it's confirmed by the chatId participants
the message was delivered
the user-receives-message object is posted to the server
it's sent to the server
(userId, messageId, senderId, date, chatType, chatId)

message fetch --- from client
when user reconnected event triggers and
sends the file id if exists over and over again
/message/id/file/id

message fetch --- from client
until the user sends the file id and
the server deletes each file deleting
the message object afterwards
since the server will keep the file

message read --- from client
when chatId participants reconnected
sends its last online to the server
(userId, chatType, chatId, date)

message status --- from server
when user reconnected event triggers and
the user-sends-message object is sent by the server
(id, date, chatType, chatId, deliveredDate, readDate)
and the user-receives-messages
id, userId, messageId, senderId, date, chatType, chatId, readDate

message status --- from client
until the user sends the user-sends-message ID
(id)

*/