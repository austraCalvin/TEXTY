import DBDate from "../DBDate";
import type IUser from "./User";

//User-Contacts-User
interface IUserContactsUser {

    "id": string;
    "userId": IUser["id"];
    "contactId": IUser["id"];
    "name": string;
    "notify": boolean;
    "read": boolean;
    "verified": boolean;
    "blocked": boolean;
    "date": DBDate;

};

export type IPartialUserContactsUser = Partial<IUserContactsUser>;

export interface IPOSTUserContactsUser {

    "userId": IUser["id"];
    "contactId": IUser["id"];
    "name"?: IUserContactsUser["name"];
    "notify"?: IUserContactsUser["notify"];
    "read"?: IUserContactsUser["read"];
    "verified"?: boolean;
    "blocked"?: IUserContactsUser["blocked"];

};

export interface IEDITUserContactsUser {

    "id": IUserContactsUser["id"];
    "name"?: IUserContactsUser["name"];
    "notify"?: IUserContactsUser["notify"];
    "read"?: IUserContactsUser["read"];
    "verified"?: boolean;
    "blocked"?: IUserContactsUser["blocked"];

};

export type IUserContactsUserKeys = Array<keyof IUserContactsUser>;

export default IUserContactsUser;