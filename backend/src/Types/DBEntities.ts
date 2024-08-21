import mongoose from "mongoose";
import IUser from "./User/User";
import IGroup from "./User/Group";
import IUserContactsUser from "./User/UserContactsUser";
import IUserJoinsGroup from "./User/UserJoinsGroup";
import IUserConfiguration from "./User/Configuration";
import IMessage from "./Message/Message";
import IFile, { IFileData } from "./Message/File";
import IUserSendsMessage from "./Message/UserSendsMessage";
import IUserReceivesMessage from "./Message/UserReceivesMessage";
import IUserConnection from "./User/UserConnection";
import IRegistration from "./Temp/Registration";
import IRecovery from "./Temp/Recovery";

// type MongoDbCollectionType<T> = mongoose.Document<unknown, {}, T> & T & { _id: mongoose.Types.ObjectId; }

// export type MongoDbCollectionType<T> = mongoose.FlattenMaps<T> & { _id: mongoose.Types.ObjectId; }

export type MongoDbEntity = IUser | IGroup | IUserContactsUser | IUserJoinsGroup | IUserConfiguration | IMessage | IFileData | IUserSendsMessage | IUserReceivesMessage | IRegistration | IRecovery;

export type SessionEntity = IUser | IGroup | IUserContactsUser | IUserJoinsGroup | IUserConfiguration | IMessage | IFile | IFileData | IUserSendsMessage | IUserReceivesMessage | IRegistration | IRecovery | IUserConnection;