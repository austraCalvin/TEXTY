import DBDate from "../DBDate";
import type IUser from "./User";

interface IUserJoinsGroup {

    "id": string;
    "userId": IUser["id"];
    "groupId": string;
    "notify": boolean;
    "read": boolean;
    "blocked": boolean;
    "admin": boolean;
    "date": DBDate

};

export type IPartialUserJoinsGroup = Partial<IUserJoinsGroup>;

export interface IPOSTUserJoinsGroup {

    "userId": IUser["id"];
    "groupId": IUserJoinsGroup["groupId"];
    "notify"?: IUserJoinsGroup["notify"];
    "read"?: IUserJoinsGroup["read"];
    "blocked"?: IUserJoinsGroup["blocked"];
    "admin"?: IUserJoinsGroup["admin"];

};

export interface IEDITUserJoinsGroup {

    "id": IUserJoinsGroup["id"];
    "notify"?: IUserJoinsGroup["notify"];
    "read"?: IUserJoinsGroup["read"];
    "blocked"?: IUserJoinsGroup["blocked"];
    "admin"?: IUserJoinsGroup["admin"];

};

export type IUserJoinsGroupKeys = Array<keyof IUserJoinsGroup>;

export default IUserJoinsGroup;