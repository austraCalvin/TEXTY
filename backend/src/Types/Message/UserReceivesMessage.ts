import type IUser from "../User/User";
import type IMessage from "./Message";
import { IUserSendsMessage } from "./UserSendsMessage";
import IReply from "./Reply";
import IChat from "../Chat";
import IFile from "./File";
import DBDate from "../DBDate";

interface IUserReceivesMessage {

    "id": string;
    "userId": IUser["id"];
    // "messageId": IMessage["id"];
    // "senderId": IUser["id"];
    "sendId": IUserSendsMessage["id"];
    "date"?: DBDate;
    "readDate"?: DBDate;
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

export interface IPartialUserReceivesMessage {

    "id"?: IUserReceivesMessage["id"];
    "userId"?: IUser["id"];
    // "messageId"?: IMessage["id"];
    // "senderId"?: IUserSendsMessage["id"];
    "sendId"?: IUserSendsMessage["id"];
    "date"?: DBDate;
    "readDate"?: DBDate;
    "chatType"?: IChat["type"];
    "chatId"?: IChat["id"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

export type IUserReceivingMessage = Omit<IUserReceivesMessage, "date" | "readDate">

export interface IUserReceivedMessage extends IUserReceivesMessage {

    "date": DBDate;

};

export interface IUserReadMessage extends IUserReceivedMessage {

    "readDate": DBDate;

};

export interface IUserReceivesReply extends IUserReceivesMessage {

    "replyType": IReply["type"];
    "replyId": IReply["id"];

};

export type IPOSTUserReceivingMessage = Omit<IUserReceivesMessage, "id" | "date" | "readDate">;

export type IEDITUserReceivesMessage = Pick<IUserReceivesMessage, "date" | "readDate">;

export type IUserReceivesMessageKeys = Array<keyof IUserReceivesMessage>;

//other section

export interface IMessageToDeliver {

    "userId": IUser["id"];
    // "messageId": IMessage["id"];
    "body"?: IMessage["body"];
    // "senderId": IUserSendsMessage["id"];
    "sendId": IUserSendsMessage["id"];
    "chatId": IChat["id"];
    "chatType": IChat["type"];
    "fileId"?: IFile["id"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

export default IUserReceivesMessage;