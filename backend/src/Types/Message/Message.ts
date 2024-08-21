import IFile, { IPOSTFile } from "./File";

export type MessageOptions = "plain-text" | "file-attached";

export interface IMessage {

    "id": string;
    // "type": MessageOptions;
    "body": string;
    "fileId": IFile["id"];

};

export interface IPartialMessage {

    "id"?: IMessage["id"];
    // "type"?: MessageOptions;
    "body"?: IMessage["body"];
    "fileId"?: IFile["id"];

};

type IOptionMessage = {

    "id": IMessage["id"];
    "body": IMessage["body"];
    "fileId"?: undefined;

} |
{
    "id": IMessage["id"];
    "body"?: IMessage["body"];
    "fileId": IFile["id"];
};

export interface IPlainTextMessage {

    "id": IMessage["id"];
    "body": IMessage["body"];
    "fileId"?: undefined;

};

export interface IFileAttachedMessage {

    "id": IMessage["id"];
    "body"?: IMessage["body"];
    "fileId": IFile["id"];

};

export type IPOSTMessage = {

    "body": IMessage["body"];
    "fileId"?: undefined;

} |
{
    "body"?: IMessage["body"];
    "fileId": IFile["id"];
};

export type IPOSTPlainTextMessage = Omit<IPlainTextMessage, "id">;

export type IPOSTFileAttachedMessage = Omit<IFileAttachedMessage, "id">;

export type IPOSTEDOptionMessage = {

    "id": IMessage["id"];
    "body": IMessage["body"];
    "fileId"?: undefined;

} |
{
    "id": IMessage["id"];
    "body"?: IMessage["body"];
    "fileId": IMessage["fileId"];
};

export interface IPOSTEDMessage {

    "id": IMessage["id"];
    "body"?: IMessage["body"];
    "fileId"?: IMessage["fileId"];

};

export interface IPOSTEDPlainTextMessage extends IPOSTEDMessage {

    "body": IMessage["body"];
    "fileId"?: undefined;

};

export interface IPOSTEDFileAttachedMessage extends IPOSTEDMessage {

    "body"?: IMessage["body"];
    "fileId": IMessage["fileId"];

};

export type IMessageKeys = Array<keyof IMessage>;

//other section

export type IMessagePending = {

    "body": IMessage["body"];
    "file"?: undefined;

} |
{

    "body"?: IMessage["body"];
    "file": IPOSTFile;

};

export interface IPlainTextMessagePending {

    "body": IMessage["body"];
    "file"?: undefined;

};

export interface IFileAttachedMessagePending {

    "body"?: IMessage["body"];
    "file": IPOSTFile;

};

export default IOptionMessage;