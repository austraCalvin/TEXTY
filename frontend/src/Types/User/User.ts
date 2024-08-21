import IUserConfiguration from "./Configuration";

interface IRefUser {

    "id": string;
    "name": string;
    "username": string;
    "password": string;
    "email": string;
    "created": Date;
    "lastOnline": Date;
    "configId": IUserConfiguration["id"];

};

interface IUser {

    "id": IRefUser["id"];
    "name": IRefUser["name"];
    "username": IRefUser["username"];
    "password": IRefUser["password"];
    "email": IRefUser["email"];
    "created": IRefUser["created"];
    "lastOnline": IRefUser["lastOnline"];
    "configId"?: IRefUser["configId"];

};

export type IPartialUser = Partial<IRefUser>;

export type IPOSTUser = Omit<IUser, "id" | "created" | "lastOnline" | "configId">;

// export type UserOptions = "login" | "session";

export type ISignupUser = Pick<IPartialUser, "name" | "username" | "password">;

export type IExistingUser = Pick<IUser, "id" | "username" | "password">;

// export type IAuthenticatedUser = Pick<IUser, "id" | "username">;

// export type ISessionUser = Pick<IUser, "id">;

export type ILoginUser = Pick<IUser, "username" | "password">;

export type IUserKeys = Array<keyof IUser>;

export default IUser;