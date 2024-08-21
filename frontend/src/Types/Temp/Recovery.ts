import IUser from "../User/User";

interface IRecovery {

    "id": string;
    "userEmail": IUser["email"];
    "type": "email" | "username" | "password";
    "ttl": Date;
    "code": number;

};

export type IPartialRecovery = Partial<IRecovery>;

export type IPOSTRecovery = Omit<IRecovery, "id" | "ttl" | "code">;

export default IRecovery;