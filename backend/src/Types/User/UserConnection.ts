import IOptionMessage, { IFileAttachedMessagePending, IMessagePending, IPlainTextMessagePending } from "../Message/Message";
import IUserReceivesMessage, { IUserReceivedMessage } from "../Message/UserReceivesMessage";
import IUserSendsMessage, { IPOSTUserSendingMessage } from "../Message/UserSendsMessage";
import { IMessageStatusFromServer } from "../SocketEvents";
import UserWebSocket from "../UserWebSocket";
import IUser from "./User";
import webpush, { PushSubscription } from "web-push";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import IChat from "../Chat";
import UserReceivesMessage from "../Message/UserReceivesMessage";

export type NotificationEnable = {
    "push": { "enabled": boolean, "success"?: webpush.SendResult, error?: any },
    "email": { "enabled": boolean, "success"?: SMTPTransport.SentMessageInfo, error?: any }
};
export type ReceiveSuccess = {
    "receive": IUserReceivedMessage,
    "notification"?: undefined
} |
{
    "receive"?: undefined,
    "notification"?: NotificationEnable
};

export type NotificationSuccess = {
    "push":
    { "enabled": boolean, "response": webpush.SendResult, "error"?: undefined } |
    { "enabled": boolean, "response"?: undefined, "error": string } |
    { "enabled": boolean, "response"?: undefined, "error"?:undefined },
    "email":
    { "enabled": boolean, "response": SMTPTransport.SentMessageInfo, "error"?: undefined } |
    { "enabled": boolean, "response"?: undefined, "error": string }|
    { "enabled": boolean, "response"?: undefined, "error"?:undefined }

};

export interface ISendNotificationPush {
    chat: {
        "id": IChat["id"];
        "name": string;
    };
    message: {
        "user_name"?: IUser["name"];
        "body": string;
    };
};

export interface IUserConnection {

    readonly id: IUser["id"];
    readonly conn: UserWebSocket | undefined;
    readonly online: boolean;
    readonly isWebpush: boolean;

    onOnline(callback: () => void): void
    onOffline(callback: () => void): void
    setOnline(state: true, connection: UserWebSocket): void;
    setOnline(state: false): void;

    setMessageStatus(sends: IMessageStatusFromServer["sends"], receives: IMessageStatusFromServer["receives"]): void
    send(userSends: IPOSTUserSendingMessage, message: IPlainTextMessagePending): Promise<IUserSendsMessage>;
    send(userSends: IPOSTUserSendingMessage, message: IFileAttachedMessagePending): Promise<IUserSendsMessage>;
    send(userSends: IPOSTUserSendingMessage, message: IMessagePending): Promise<IUserSendsMessage>
    receive(userReceivesMessage: IUserReceivesMessage, message: IOptionMessage): Promise<ReceiveSuccess>

    subscribe(sub: PushSubscription): void;
    unsubscribe(): void;
    sendNotification(userReceivesMessage: UserReceivesMessage, message: IOptionMessage): Promise<NotificationSuccess>

};

export type IPartialUserConnection = Partial<IUserConnection>;

export interface IPOSTUserConnection {
    "id": IUser["id"],
    "connection": UserWebSocket;
};

export default IUserConnection;