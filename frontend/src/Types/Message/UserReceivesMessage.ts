import type IUser from "../User/User";
import type IMessage from "./Message";
import IRefUserSendsMessage, {IUserSendsMessage } from "./UserSendsMessage";
import IReply from "./Reply";
import IChat from "../Chat";

interface IUserReceivesMessage {

    "id": string;
    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "senderId"?: IUser["id"];
    "sendId": IRefUserSendsMessage["id"];
    "date": IUserSendsMessage["date"];
    "readDate"?: IUserSendsMessage["readDate"];
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];
    
};

export interface IPartialUserReceivesMessage {

    "id"?: IUserReceivesMessage["id"];
    "userId"?: IUser["id"];
    "messageId"?: IMessage["id"];
    "senderId"?: IUserSendsMessage["id"];
    "sendId"?: IUserSendsMessage["id"];
    "date"?: IUserSendsMessage["date"];
    "readDate"?: IUserSendsMessage["readDate"];
    "chatType"?: IChat["type"];
    "chatId"?: IChat["id"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];

};

export type IUserReceivingMessage = Omit<IUserReceivesMessage, "date" | "readDate">

export interface IUserReceivedMessage extends IUserReceivesMessage {

    "date": IUserSendsMessage["date"];

};

export interface IUserReadMessage extends IUserReceivedMessage {

    "readDate": IUserSendsMessage["date"];

};

export type IPOSTUserReceivingMessage = {

    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "senderId": IUser["id"];
    "sendId": IUserSendsMessage["id"];
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "replyType"?: "send" | "receive" | undefined;
    "replyId"?: string | undefined;
    
};


export default IUserReceivesMessage;