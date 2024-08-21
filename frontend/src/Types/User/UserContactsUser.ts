import type IUser from "./User";

//Reference
interface IContact {

    "id": string;
    "userId": IUser["id"],
    "type": "contact";
    // "userId": IUser["id"];
    // "contactId": IUser["id"];
    "name": string;
    "description": string;
    // "notify": boolean;
    // "read": boolean;
    // "blocked": boolean;
    // "date": Date;

};

//Universal
export interface IPOSTEDContact {

    "id": IContact["id"];
    "userId": IUser["id"];
    "type": IContact["type"];
    "name": IContact["name"];
    "description"?: IContact["description"];

};

export type IPartialUserContactsUser = Partial<IContact>;

export interface IPOSTUserContactsUser {

    "type": "contact";
    // "userId": IUser["id"];
    // "contactId": IUser["id"];
    "name"?: IContact["name"];
    "description"?: IContact["description"];
    // "notify"?: IContact["notify"];
    // "read"?: IContact["read"];
    // "blocked"?: IContact["blocked"];

};

export interface IEDITUserContactsUser {

    "id": IContact["id"];
    "type": "contact";
    "name"?: IContact["name"];
    "description"?: IContact["description"];
    // "notify"?: IContact["notify"];
    // "read"?: IContact["read"];
    // "blocked"?: IContact["blocked"];

};

export type IContactKeys = Array<keyof IContact>;

export type IContactState = {
    "online": true,
    "lastOnline": Date
} |
{
    "online": false,
    "lastOnline": undefined
};

export default IContact;