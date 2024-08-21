import DBDate from "../DBDate";
import IUserConfiguration from "./Configuration";

export interface IUser {

    "id": string;
    "name": string;
    "username": string;
    "description"?: string;
    "password": string;
    "email": string;
    "created": DBDate;
    "lastOnline": DBDate;
    "configId"?: IUserConfiguration["id"];

};


export type IPartialUser = Partial<IUser>;

export type IPOSTUser = Omit<IUser, "id" | "description" | "created" | "lastOnline" | "configId">;

// export type UserOptions = "login" | "session";

// export type ISignupUser = Pick<IUser, "username" | "password" | "email" | "created">;

// export type IExistingUser = Pick<IUser, "id" | "username" | "password">;

// export type IAuthenticatedUser = Pick<IUser, "id" | "username">;

export type ISessionUser = Pick<IUser, "id">;

export type ILoginUser = Pick<IUser, "username" | "password">;

export type IUserKeys = Array<keyof IUser>;

export default IUser;