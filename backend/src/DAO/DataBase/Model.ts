import { CollectionOptions, ServiceCollectionOptions, type DataBaseOptions, type ServiceDataBaseOptions } from "../../Types/DataBase";
import mongoose, { } from "mongoose";
import { IDAOMethods } from "../../Types/IDAOMethods";
import IFile, { IFileData } from "../../Types/Message/File";
import IMessage from "../../Types/Message/Message";
import IUserReceivesMessage from "../../Types/Message/UserReceivesMessage";
import IUserSendsMessage from "../../Types/Message/UserSendsMessage";
import IUserConfiguration from "../../Types/User/Configuration";
import IGroup from "../../Types/User/Group";
import IUser from "../../Types/User/User";
import IUserConnection from "../../Types/User/UserConnection";
import IUserContactsUser from "../../Types/User/UserContactsUser";
import IUserJoinsGroup from "../../Types/User/UserJoinsGroup";
import FileModel from "./MongoDB/Message/File";
import MessageMongoDB from "./MongoDB/Message/Message";
import UserReceivesMessageMongoDB from "./MongoDB/Message/UserReceivesMessage";
import UserSendsMessageMongoDB from "./MongoDB/Message/UserSendsMessage";
import UserMongoDB from "./MongoDB/User/User";
import UserConfigurationModel from "./Session/User/Configuration";
import UserConnectionModel from "./Session/User/UserConnection";
import FileMongoDB from "../DataBase/MongoDB/Message/File";
import GroupMongoDB from "../DataBase/MongoDB/User/Group";
import UserContactsUserMongoDB from "../DataBase/MongoDB/User/UserContactsUser";
import UserJoinsGroupMongoDB from "../DataBase/MongoDB/User/UserJoinsGroup";
import ConfigurationMongoDB from "../DataBase/MongoDB/User/Configuration";
import IRegistration from "../../Types/Temp/Registration";
import RegistrationMongoDB from "./MongoDB/Temp/Registration";
import RegistrationSession from "./MongoDB/Temp/Registration";
import IRecovery from "../../Types/Temp/Recovery";
import RecoveryMongoDB from "./MongoDB/Temp/Recovery";
import RecoverySession from "./Session/Temp/Recovery";
import { IMessageRequest } from "../../Types/Message/Request";
import MessageRequestMongoDB from "./MongoDB/Message/Request";

export const databaseChosen = "mongodb";

class ModelFactory {

    static dataBase(name: "session-storage"): SessionStorageModel;
    static dataBase(name: "mongodb"): MongoDBModel;
    static dataBase(name: DataBaseOptions): ServiceDataBaseOptions {

        if (typeof name !== "string") {

            throw new TypeError("name parameter must be a string");

        };

        if (name === "mongodb") {

            const config = {

                "username": "austra",
                "password": "8971036",
                "dbName": "chatapp",
                "isLocal": true,
                "host": {
                    "hostname": "127.0.0.1",
                    "port": 27017,
                },
                "connection": mongoose.connection

            };

            const uri = config.isLocal
                ?
                (`mongodb://${config.host.hostname}:${config.host.port}/${config.dbName}`)
                :
                (`mongodb+srv://${config.username}:${config.password}@cluster0.drohkax.mongodb.net/${config.dbName}?retryWrites=true&w=majority`);

            if (config.connection.readyState === 0) {

                mongoose.connect(uri).then(() => { }).catch((err) => { });

            };

            return new MongoDBModel;

        };

        return new SessionStorageModel;

    };

};

export class MongoDBModel {

    collection(name: "users"): IDAOMethods<IUser>;
    collection(name: "user-configuration"): IDAOMethods<IUserConfiguration>;
    collection(name: "messages"): IDAOMethods<IMessage>;
    collection(name: "user-sends-message"): IDAOMethods<IUserSendsMessage>;
    collection(name: "user-receives-message"): IDAOMethods<IUserReceivesMessage>;
    collection(name: "files"): IDAOMethods<IFileData>;
    collection(name: "groups"): IDAOMethods<IGroup>;
    collection(name: "user-contacts-user"): IDAOMethods<IUserContactsUser>;
    collection(name: "user-joins-group"): IDAOMethods<IUserJoinsGroup>;
    collection(name: "registrations"): IDAOMethods<IRegistration>;
    collection(name: "recoveries"): IDAOMethods<IRecovery>;
    collection(name: "message-requests"): IDAOMethods<IMessageRequest>;

    collection(name: CollectionOptions): ServiceCollectionOptions {

        if (!name || (typeof name !== "string")) {

            throw new TypeError("name parameter must be a string");

        };

        switch (name) {

            case "users":
                return new UserMongoDB;

            case "user-configuration":
                return new ConfigurationMongoDB;

            case "messages":
                return new MessageMongoDB;

            case "user-sends-message":
                return new UserSendsMessageMongoDB;

            case "user-receives-message":
                return new UserReceivesMessageMongoDB;

            case "files":
                return new FileMongoDB;

            case "groups":
                return new GroupMongoDB;

            case "user-contacts-user":
                return new UserContactsUserMongoDB;

            case "user-joins-group":
                return new UserJoinsGroupMongoDB;

            case "registrations":
                return new RegistrationMongoDB;

            case "recoveries":
                return new RecoveryMongoDB;

            case "message-requests":
                return new MessageRequestMongoDB;

        };

    };

};

const userConnectionModelCreated = new UserConnectionModel;

export class SessionStorageModel {

    collection(name: "users"): IDAOMethods<IUser>;
    collection(name: "user-configuration"): IDAOMethods<IUserConfiguration>;
    collection(name: "messages"): IDAOMethods<IMessage>;
    collection(name: "user-sends-message"): IDAOMethods<IUserSendsMessage>;
    collection(name: "user-receives-message"): IDAOMethods<IUserReceivesMessage>;
    collection(name: "files"): IDAOMethods<IFileData>;
    collection(name: "files-content"): IDAOMethods<IFile>;
    collection(name: "groups"): IDAOMethods<IGroup>;
    collection(name: "user-contacts-user"): IDAOMethods<IUserContactsUser>;
    collection(name: "user-joins-group"): IDAOMethods<IUserJoinsGroup>;
    collection(name: "registrations"): IDAOMethods<IRegistration>;
    collection(name: "userConnections"): IDAOMethods<IUserConnection>;
    collection(name: "recoveries"): IDAOMethods<IRecovery>;
    collection(name: "message-requests"): IDAOMethods<IMessageRequest>;

    collection(name: CollectionOptions | "files-content" | "userConnections"): ServiceCollectionOptions | IDAOMethods<IFile> | IDAOMethods<IUserConnection> {

        if (!name || (typeof name !== "string")) {

            throw new TypeError("name parameter must be a string");

        };

        switch (name) {

            case "users":
                return new UserMongoDB;

            case "user-configuration":
                return new UserConfigurationModel;

            case "messages":
                return new MessageMongoDB;

            case "user-sends-message":
                return new UserSendsMessageMongoDB;

            case "user-receives-message":
                return new UserReceivesMessageMongoDB;

            case "files":
                return new FileMongoDB;

            case "files-content":
                return new FileModel;

            case "groups":
                return new GroupMongoDB;

            case "user-contacts-user":
                return new UserContactsUserMongoDB;

            case "user-joins-group":
                return new UserJoinsGroupMongoDB;

            case "userConnections":
                return userConnectionModelCreated;

            case "registrations":
                return new RegistrationSession;

            case "recoveries":
                return new RecoverySession;

            case "message-requests":
                return new MessageRequestMongoDB;

        };

    };

};


export default ModelFactory;