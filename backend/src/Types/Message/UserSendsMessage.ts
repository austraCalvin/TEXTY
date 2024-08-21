import type IUser from "../User/User";
import type IMessage from "./Message";
import IReply from "./Reply";
import IChat from "../Chat";
import DBDate from "../DBDate";

export interface IUserSendsMessage {

    "id": string;
    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "date": DBDate;
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "deliveredDate": DBDate;
    "readDate": DBDate;
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

export interface IPartialUserSendsMessage {

    "id"?: IUserSendsMessage["id"];
    "userId"?: IUser["id"];
    "messageId"?: IMessage["id"];
    "date"?: DBDate;
    "chatType"?: IChat["type"];
    "chatId"?: IChat["id"];
    "deliveredDate"?: DBDate;
    "readDate"?: DBDate;
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

export interface IUserSentMessage {

    "id": IUserSendsMessage["id"];
    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "date": DBDate;
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];
};

export type IPOSTUserSendingMessage = Omit<IUserSentMessage, "id" | "userId" | "messageId" | "deliveredDate" | "readDate">;

export type IPOSTUserSendsMessage = Omit<IUserSentMessage, "id">;

export interface IUserSendsMessageReceived extends IUserSentMessage{

    "deliveredDate": DBDate;

};

export interface IUserSendsMessageRead extends IUserSendsMessageReceived{

    "readDate": DBDate;

};

export interface IUserSendsGroupMessage {

    "id": IUserSendsMessage["id"];
    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "date": DBDate;
    "chatType": "group";
    "chatId": IChat["id"];
    "deliveredDate"?:DBDate;
    "readDate"?:DBDate;
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

export type IUserSendsMessageKeys = Array<keyof IUserSendsMessage>;

interface IRefUserSendsMessage {

    "id": IUserSendsMessage["id"];
    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "date": DBDate;
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "deliveredDate"?: DBDate;
    "readDate"?: DBDate;
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

//other section

export interface IMessageSent {

    "id": IUserSendsMessage["id"];
    "userId": IUser["id"]
    "messageId": IMessage["id"]
    "date": IUserSendsMessage["date"];
    "chatType": IChat["type"];
    "chatId": IChat["id"];

};

export default IRefUserSendsMessage;