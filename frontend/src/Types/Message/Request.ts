export interface IMessageRequest {

    "id": string;
    "userId": string;
    "messageId": string;
    "contactId": string;

};

export interface ILocalMessageRequest {

    "id": string;
    "userId"?: string;
    "messageId": string;
    "contactId"?: string;

};