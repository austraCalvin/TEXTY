import type IUser from "./User";

interface IUserJoinsGroup {

    "id": string;
    "userId": IUser["id"];
    "groupId": string;
    "username": IUser["username"];
    "notify": boolean;
    "read": boolean;
    "blocked": boolean;
    "admin": boolean;
    "date": Date

};

export type IPartialUserJoinsGroup = Partial<IUserJoinsGroup>;

export interface IPOSTUserJoinsGroup {

    "userId": IUser["id"];
    "groupId": IUserJoinsGroup["groupId"];
    "username"?: IUser["username"];
    "notify"?: IUserJoinsGroup["notify"];
    "read"?: IUserJoinsGroup["read"];
    "blocked"?: IUserJoinsGroup["blocked"];
    "admin"?: IUserJoinsGroup["admin"];

};

export interface IEDITUserJoinsGroup {

    "id": IUserJoinsGroup["id"];
    "username"?: IUser["username"];
    "notify"?: IUserJoinsGroup["notify"];
    "read"?: IUserJoinsGroup["read"];
    "blocked"?: IUserJoinsGroup["blocked"];
    "admin"?: IUserJoinsGroup["admin"];

};

export type IUserJoinsGroupKeys = Array<keyof IUserJoinsGroup>;

export default IUserJoinsGroup;