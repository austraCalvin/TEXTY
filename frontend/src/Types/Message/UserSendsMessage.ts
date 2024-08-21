import type IUser from "../User/User";
import type IMessage from "./Message";
import IReply from "./Reply";
import IChat from "../Chat";

export type IRefUserSendsMessage = {

    "id": string;
    "userId": IUser["id"];
    "messageId": IMessage["id"];
    "date": string;
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "deliveredDate": string;
    "readDate": string;
    "replyType": IReply["type"];
    "replyId": IReply["id"];
    "sent": boolean;

};

export interface IUserSendsMessage {

    "id": IRefUserSendsMessage["id"];
    "userId": IRefUserSendsMessage["userId"];
    "messageId": IMessage["id"];
    "date": IRefUserSendsMessage["date"];
    "chatType": IChat["type"];
    "chatId": IChat["id"];
    "deliveredDate"?: IRefUserSendsMessage["deliveredDate"];
    "readDate"?: IRefUserSendsMessage["readDate"];
    "replyType"?: IReply["type"];
    "replyId"?: IReply["id"];
    "sent": IRefUserSendsMessage["sent"];

};

export type IPartialUserSendsMessage = Partial<IUserSendsMessage>;

export interface IUserSendingMessage extends IUserSendsMessage {

    "sent": false;

};

export interface IUserSentMessage extends IUserSendsMessage {

    "sent": true;

};

export type IPOSTUserSendsMessage = Pick<IUserSendsMessage, "date" | "chatType" | "chatId" | "replyType" | "replyId">;

export default IRefUserSendsMessage;