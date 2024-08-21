export type MessageOptions = "plain-text" | "file-attached";

interface IMessage {

    "id": string;
    "body": string;

};

export type IPartialMessage = Partial<IMessage>;

export type IPOSTMessage = Pick<IMessage, "body">;

export type IPOSTEDMessage = Pick<IMessage, "id" | "body">;

export default IMessage;