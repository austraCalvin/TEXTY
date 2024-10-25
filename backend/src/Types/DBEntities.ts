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
import { IMessageRequest } from "./Message/Request";

// type MongoDbCollectionType<T> = mongoose.Document<unknown, {}, T> & T & { _id: mongoose.Types.ObjectId; }

// export type MongoDbCollectionType<T> = mongoose.FlattenMaps<T> & { _id: mongoose.Types.ObjectId; }

export type MongoDbEntity = IUser | IGroup | IUserContactsUser | IUserJoinsGroup | IUserConfiguration | IMessage | IFileData | IUserSendsMessage | IUserReceivesMessage | IRegistration | IRecovery | IMessageRequest;

export type SessionEntity = MongoDbEntity | IFile | IUserConnection;

export type EntityReturnTypeOne<T> = T extends IUser ? IUser : T extends IGroup ? IGroup : T extends IUserContactsUser ? IUserContactsUser : T extends IUserJoinsGroup ? IUserJoinsGroup : T extends IUserConfiguration ? IUserConfiguration : T extends IMessage ? IMessage : T extends IFileData ? IFileData : T extends IUserSendsMessage ? IUserSendsMessage : T extends IUserReceivesMessage ? IUserReceivesMessage : T extends IRegistration ? IRegistration : T extends IRecovery ? IRecovery : IMessageRequest;

export type EntityReturnTypeMany<T> = (T extends IUser ? IUser[] : T extends IGroup ? IGroup[] : T extends IUserContactsUser ? IUserContactsUser[] : T extends IUserJoinsGroup ? IUserJoinsGroup[] : T extends IUserConfiguration ? IUserConfiguration[] : T extends IMessage ? IMessage[] : T extends IFileData ? IFileData[] : T extends IUserSendsMessage ? IUserSendsMessage[] : T extends IUserReceivesMessage ? IUserReceivesMessage[] : T extends IRegistration ? IRegistration[] : T extends IRecovery ? IRecovery[] : IMessageRequest[]);