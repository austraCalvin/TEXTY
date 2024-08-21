import type { CollectionOptions, ServiceCollectionOptions } from "../../../Types/DataBase";
import UserModel from "./User/User";
import MessageModel from "./Message/Message";
import UserConnectionModel from "./User/UserConnection";
import { IDAOMethods, getManyModel } from "../../../Types/IDAOMethods";
import IMessage from "../../../Types/Message/Message";
import IUser from "../../../Types/User/User";
import IUserConnection from "../../../Types/User/UserConnection";
import IUserSendsMessage from "../../../Types/Message/UserSendsMessage";
import UserSendsMessageModel from "./Message/UserSendsMessage";
import UserReceivesMessageModel from "./Message/UserReceivesMessage";
import IUserReceivesMessage from "../../../Types/Message/UserReceivesMessage";
import IFile, { IFileData } from "../../../Types/Message/File";
import FileModel from "./Message/File";
import IGroup from "../../../Types/User/Group";
import IUserContactsUser from "../../../Types/User/UserContactsUser";
import IUserJoinsGroup from "../../../Types/User/UserJoinsGroup";
import GroupMongoDB from "../MongoDB/User/Group";
import UserContactsUserMongoDB from "../MongoDB/User/UserContactsUser";
import UserJoinsGroupMongoDB from "../MongoDB/User/UserJoinsGroup";
import FileMongoDB from "../MongoDB/Message/File";
import IUserConfiguration from "../../../Types/User/Configuration";
import UserConfigurationModel from "./User/Configuration";
import { SessionEntity } from "../../../Types/DBEntities";
import IRegistration from "../../../Types/Temp/Registration";
import IRecovery from "../../../Types/Temp/Recovery";

export abstract class SessionEntityTemplate<T extends SessionEntity> {

    protected elements: any[];
    protected abstract readonly errorOrigin: string;

    constructor() {

        this.elements = [];

    };

    async getMany(model: getManyModel<T>, limit: number): Promise<(T extends IUser ? IUser[] : T extends IGroup ? IGroup[] : T extends IUserContactsUser ? IUserContactsUser[] : T extends IUserJoinsGroup ? IUserJoinsGroup[] : T extends IUserConfiguration ? IUserConfiguration[] : T extends IMessage ? IMessage[] : T extends IFile ? IFile[] : T extends IFileData ? IFileData[] : T extends IUserSendsMessage ? IUserSendsMessage[] : T extends IUserReceivesMessage ? IUserReceivesMessage[] : T extends IUserConnection ? IUserConnection[] : T extends IRegistration ? IRegistration[] : IRecovery[]) | null>;

    async getMany(model: getManyModel<T>): Promise<(T extends IUser ? IUser[] : T extends IGroup ? IGroup[] : T extends IUserContactsUser ? IUserContactsUser[] : T extends IUserJoinsGroup ? IUserJoinsGroup[] : T extends IUserConfiguration ? IUserConfiguration[] : T extends IMessage ? IMessage[] : T extends IFile ? IFile[] : T extends IFileData ? IFileData[] : T extends IUserSendsMessage ? IUserSendsMessage[] : T extends IUserReceivesMessage ? IUserReceivesMessage[] : T extends IUserConnection ? IUserConnection[] : T extends IRegistration ? IRegistration[] : IRecovery[]) | null>;

    async getMany(): Promise<(T extends IUser ? IUser[] : T extends IGroup ? IGroup[] : T extends IUserContactsUser ? IUserContactsUser[] : T extends IUserJoinsGroup ? IUserJoinsGroup[] : T extends IUserConfiguration ? IUserConfiguration[] : T extends IMessage ? IMessage[] : T extends IFile ? IFile[] : T extends IFileData ? IFileData[] : T extends IUserSendsMessage ? IUserSendsMessage[] : T extends IUserReceivesMessage ? IUserReceivesMessage[] : T extends IUserConnection ? IUserConnection[] : T extends IRegistration ? IRegistration[] : IRecovery[]) | null>;

    async getMany(model?: getManyModel<T>, limit?: number): Promise<(T extends IUser ? IUser[] : T extends IGroup ? IGroup[] : T extends IUserContactsUser ? IUserContactsUser[] : T extends IUserJoinsGroup ? IUserJoinsGroup[] : T extends IUserConfiguration ? IUserConfiguration[] : T extends IMessage ? IMessage[] : T extends IFile ? IFile[] : T extends IFileData ? IFileData[] : T extends IUserSendsMessage ? IUserSendsMessage[] : T extends IUserReceivesMessage ? IUserReceivesMessage[] : T extends IUserConnection ? IUserConnection[] : T extends IRegistration ? IRegistration[] : IRecovery[]) | null> {

        if (!this.elements[0]) {

            return Promise.resolve(null);

        };

        let result: any[];

        if (model) {

            console.log(`UserConnection session storage instance - filterQuery:`, model);
            console.log(`UserConnection session storage instance - elements:`, this.elements.length ? this.elements.map((each) => ({ "userId": each.id, "online": each.connection ? each.connection.connected : false })) : "empty");

            const filtered = this.elements.filter((value) => {

                if (Object.prototype.toString.call(model.id) === "[object Array]") {

                    return (model.id as string[]).includes(value.id);

                } else {

                    return value.id === model.id;

                };

            });

            const sliceConfig = {
                "start": 0,
                "end": limit ? limit : filtered.length
            };

            // result = filtered.slice(sliceConfig.start, sliceConfig.end);
            result = filtered;


        } else {

            result = this.elements.slice(0, limit ? limit : this.elements.length);

        };

        return Promise.resolve(result as (T extends IUser ? IUser[] : T extends IGroup ? IGroup[] : T extends IUserContactsUser ? IUserContactsUser[] : T extends IUserJoinsGroup ? IUserJoinsGroup[] : T extends IUserConfiguration ? IUserConfiguration[] : T extends IMessage ? IMessage[] : T extends IFile ? IFile[] : T extends IFileData ? IFileData[] : T extends IUserSendsMessage ? IUserSendsMessage[] : T extends IUserReceivesMessage ? IUserReceivesMessage[] : T extends IUserConnection ? IUserConnection[] : T extends IRegistration ? IRegistration[] : IRecovery[]));

    };

    async getOne(model: Partial<T>) {

        if (!this.elements[0]) {

            return Promise.resolve(null);

        };

        const foundElement = this.elements.find((value) => {

            if (model.id) {

                return value.id === model.id;

            };

        });

        if (!foundElement) {

            return Promise.resolve(null);

        };

        return Promise.resolve(foundElement as (T extends IUser ? IUser : T extends IGroup ? IGroup : T extends IUserContactsUser ? IUserContactsUser : T extends IUserJoinsGroup ? IUserJoinsGroup : T extends IUserConfiguration ? IUserConfiguration : T extends IMessage ? IMessage : T extends IFile ? IFile : T extends IFileData ? IFileData : T extends IUserSendsMessage ? IUserSendsMessage : T extends IUserReceivesMessage ? IUserReceivesMessage : T extends IUserConnection ? IUserConnection : T extends IRegistration ? IRegistration : IRecovery));

    };

    async postMany(models: T[]) {

        const previousLength = this.elements.length;
        const newLength = this.elements.push(...models);

        return Promise.resolve(this.elements.slice(previousLength - 1, newLength) as (T extends IUser ? IUser[] : T extends IGroup ? IGroup[] : T extends IUserContactsUser ? IUserContactsUser[] : T extends IUserJoinsGroup ? IUserJoinsGroup[] : T extends IUserConfiguration ? IUserConfiguration[] : T extends IMessage ? IMessage[] : T extends IFile ? IFile[] : T extends IFileData ? IFileData[] : T extends IUserSendsMessage ? IUserSendsMessage[] : T extends IUserReceivesMessage ? IUserReceivesMessage[] : T extends IUserConnection ? IUserConnection[] : T extends IRegistration ? IRegistration[] : IRecovery[]))

    };

    async postOne(model: T) {

        const pushedUserIndex = this.elements.push(model);

        return Promise.resolve(this.elements[pushedUserIndex - 1] as (T extends IUser ? IUser : T extends IGroup ? IGroup : T extends IUserContactsUser ? IUserContactsUser : T extends IUserJoinsGroup ? IUserJoinsGroup : T extends IUserConfiguration ? IUserConfiguration : T extends IMessage ? IMessage : T extends IFile ? IFile : T extends IFileData ? IFileData : T extends IUserSendsMessage ? IUserSendsMessage : T extends IUserReceivesMessage ? IUserReceivesMessage : T extends IUserConnection ? IUserConnection : T extends IRegistration ? IRegistration : IRecovery));

    };

    async patchMany(model: Partial<T>[], update: Partial<T>): Promise<boolean> {

        return Promise.reject();

    };

    async patchOne(model: Partial<T>, update: Partial<T>): Promise<boolean> {

        const elementIndex = this.elements.findIndex((value, index) => {

            if (value.id === model.id) {

                return true;

            };

        });

        if (elementIndex === -1) {

            return Promise.resolve(false);

        };

        this.elements[elementIndex] = { ...this.elements[elementIndex], ...update };

        return Promise.resolve(true);

    };

    async deleteOne(modelId: string): Promise<boolean> {

        const elementIndex = this.elements.findIndex((value) => {

            return value.id === modelId;

        });

        if (elementIndex === -1) {

            return Promise.resolve(false);

        };

        this.elements.splice(elementIndex, 1);

        return Promise.resolve(true);

    };

};