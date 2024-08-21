
import { SessionStorageModel, MongoDBModel } from "../DAO/DataBase/Model";
import type { IDAOMethods } from "./IDAOMethods";
import { IFileData } from "./Message/File";
import IMessage from "./Message/Message";
import IUserReceivesMessage from "./Message/UserReceivesMessage";
import IUserSendsMessage from "./Message/UserSendsMessage";
import IRegistration from "./Temp/Registration";
import IUserConfiguration from "./User/Configuration";
import IGroup from "./User/Group";
import IUser from "./User/User";
import IUserContactsUser from "./User/UserContactsUser";
import IUserJoinsGroup from "./User/UserJoinsGroup";
import IRecovery from "./Temp/Recovery";

export type DataBaseOptions = "session-storage" | "mongodb";
export type CollectionOptions = "users" | "user-configuration" | "messages" | "files" | "user-sends-message" | "user-receives-message" | "groups" | "user-contacts-user" | "user-joins-group" | "registrations" | "recoveries";

export interface IDataBase {

    (name: "mongodb"): MongoDBModel;
    (name: "session-storage"): SessionStorageModel;
    // (name: DataBaseOptions):ServiceDataBaseOptions;

};

export interface ICollection {
    (name: "users"): IDAOMethods<IUser>;
    (name: "messages"): IDAOMethods<IMessage>;
    (name: "user-sends-message"): IDAOMethods<IUserSendsMessage>;
    (name: "user-receives-message"): IDAOMethods<IUserReceivesMessage>;
    (name: "files"): IDAOMethods<IFileData>;
    (name: "groups"): IDAOMethods<IGroup>;
    (name: "user-contacts-user"): IDAOMethods<IUserContactsUser>;
    (name: "user-joins-group"): IDAOMethods<IUserJoinsGroup>;
    (name: "user-configuration"): IDAOMethods<IUserConfiguration>;
    (name: "registrations"): IDAOMethods<IRegistration>;
    (name: "recoveries"): IDAOMethods<IRecovery>;
    // (name: CollectionOptions): ServiceCollectionOptions;
};

export type ServiceDataBaseOptions = SessionStorageModel | MongoDBModel;
export type ServiceCollectionOptions = IDAOMethods<IUser> | IDAOMethods<IUserConfiguration> | IDAOMethods<IMessage> | IDAOMethods<IUserSendsMessage> | IDAOMethods<IUserReceivesMessage> | IDAOMethods<IFileData> | IDAOMethods<IGroup> | IDAOMethods<IUserContactsUser> | IDAOMethods<IUserJoinsGroup> | IDAOMethods<IRegistration> | IDAOMethods<IRecovery>;

// export class ModelFactoryType {

//     static dataBase: IDataBase;

// };