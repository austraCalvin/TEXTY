import Joi from "joi";
import IUser, { IPOSTUser } from "../../../Types/User/User";
import { idJoiSchema, userJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import IUserConfiguration, { IPOSTUserConfiguration } from "../../../Types/User/Configuration";
import UserConfigFactory from "./Configuration";
import IChat from "../../../Types/Chat";
import UserContactsUserFactory from "./UserContactsUser";
import UserJoinsGroupFactory from "./UserJoinsGroup";
import GroupFactory from "./Group";

export class UserComposite {

    public readonly elements: Partial<Record<IUser["id"], IUser>>;;

    constructor(initialValue: IUser[]) {

        const result: Partial<Record<IUser["id"], IUser>> = {};

        initialValue.forEach((each) => {

            result[each.id] = each;

        });

        this.elements = result;

    };

    id(val: IUser["id"]) {

        return new User(this.elements[val] as IUser);

    };

    async lookup(): Promise<Partial<Record<string, IUserConfiguration>>> {

        const filterQuery: IUserConfiguration["id"][] = [];

        for (const key in this.elements) {

            const userData = this.elements[key] as IUser;

            if (userData.configId) {

                filterQuery.push(userData.configId);

            };

        };

        if (!filterQuery.length) {

            return {};

        };

        const userConfigs = await UserConfigFactory.find(filterQuery).catch((err) => {

            console.log(err);

        });

        if (userConfigs === undefined) {

            return Promise.reject();

        };

        return userConfigs ? userConfigs : {};

    };

    async isAllowed(chatType: "group", chatId: IChat["id"], reverse?: true): Promise<Record<string, { "blocked": boolean, "messages": boolean, "read": boolean }>>
    async isAllowed(chatType: "contact", chatId: IChat["id"], reverse?: true): Promise<Record<string, { "contact": boolean, "blocked": boolean, "messages": boolean, "read": boolean }>>
    async isAllowed(chatType: IChat["type"], chatId: IChat["id"], reverse?: true) {

        console.log(`IS ALLOWED - params - chatType=${chatType} - chatId=${chatId}`);

        //get the contact-users ids
        const userIds: IUser["id"][] = Object.keys(this.elements);

        if (chatType === "contact") {

            const foundElement = await UserContactsUserFactory.find({ "userId": !reverse ? userIds : [chatId], "contactId": !reverse ? [chatId] : userIds }).catch((err) => {

                console.log(err);

            });

            if (foundElement === undefined) {

                return Promise.reject();

            };

            const unique: Record<IUser["id"], { "contact": boolean, "blocked": boolean, "messages": boolean, "read": boolean }> = {};

            if (!reverse) {

                const userConfig = await this.lookup().catch((err) => {

                    console.log(err);

                });

                if (userConfig === undefined) {

                    return Promise.reject();

                };

                for (let userId in this.elements) {

                    const currentUser = this.elements[userId] as IUser,
                        configId = currentUser.configId;

                    unique[userId] = {
                        "contact": false,
                        "blocked": false,
                        "messages": true,
                        "read": true
                    };

                    const currentConfig = userConfig[configId ? configId : ""] as IUserConfiguration;

                    const configValue = currentConfig.approve === "both" || currentConfig.approve === "contact" ? false : true;

                    unique[userId].messages = configValue;
                    unique[userId].read = configValue ? currentConfig.read : false;

                };

            };

            if (foundElement) {

                foundElement.forEach((each) => {

                    const configValue = each.blocked ? false : true;

                    unique[!reverse ? each.userId : each.contactId] = {
                        "contact": true,
                        "blocked": each.blocked,
                        "messages": configValue,
                        "read": configValue ? each.read : false
                    };

                });

            };

            return unique;

        } else if (chatType === "group") {

            const foundElement = await UserJoinsGroupFactory.find({ "userId": userIds, "groupId": [chatId] }).catch((err) => {

                console.log(err);

            });

            if (foundElement === undefined) {

                return Promise.reject();

            };

            if (foundElement === null) {

                return Promise.reject();

            };

            const grougConfig = await GroupFactory.findById(chatId).catch((err) => {

                console.log(err);

            });

            if (!grougConfig) {

                return Promise.reject();

            };

            const unique: Record<IUser["id"], { "blocked": boolean, "messages": boolean, "read": boolean }> = {};

            foundElement.forEach((each) => {

                const configValue = !each.blocked;

                unique[each.userId] = {
                    "blocked": each.blocked,
                    "messages": configValue ? grougConfig.messages : false,
                    "read": configValue ? each.read : false
                };

            });

            return unique;

        };

        return Promise.reject();

    };

    forEach(callback: (each: IUser) => void) {

        for (const key in this.elements) {

            callback(this.elements[key] as IUser);

        };

    };

    filter(callback: (each: IUser) => unknown) {

        const result = [];

        for (const key in this.elements) {

            const allowed = callback(this.elements[key] as IUser);

            if (allowed) {

                result.push(this.elements[key] as IUser);

            };

        };

        return new UserComposite(result);

    };

};

export class User implements IUser {

    public readonly id;
    public readonly name;
    public readonly username;
    public readonly description;
    public readonly password;
    public readonly email;
    public readonly created;
    public readonly lastOnline;
    public readonly configId;

    constructor({ id, name, username, description, password, email, created, lastOnline, configId }: IUser) {

        this.id = id;
        this.name = name;
        this.username = username;
        this.description = description;
        this.password = password;
        this.email = email;
        this.created = created;
        this.lastOnline = lastOnline;
        this.configId = configId;

    };

    async isAllowed(chatType: "group", chatId: IChat["id"]): Promise<{ "blocked": boolean, "messages": boolean, "read": boolean }>
    async isAllowed(chatType: "contact", chatId: IChat["id"]): Promise<{ "contact": boolean, "blocked": boolean, "messages": boolean, "read": boolean }>
    async isAllowed(chatType: IChat["type"], chatId: IChat["id"]) {

        if (chatType === "contact") {

            const contactId = chatId;

            const foundElement = await UserContactsUserFactory.findByUserIds(this.id, contactId).catch((err) => {

                console.log(err);

            });

            if (foundElement === undefined) {

                return Promise.reject();

            };

            if (foundElement === null) {

                const userConfig = await UserFactory.getConfig(contactId).catch((err) => {

                    console.log(err);

                });

                if (userConfig === undefined) {

                    return Promise.reject();

                };

                if (userConfig === null) {

                    return {
                        "contact": false,
                        "blocked": false,
                        "messages": true,
                        "read": true
                    };

                };

                const configValue = userConfig.approve === "both" || userConfig.approve === "contact" ? false : true

                console.log({
                    "contact": false,
                    "blocked": false,
                    "messages": configValue,
                    "read": userConfig.read
                });

                return {
                    "contact": false,
                    "blocked": false,
                    "messages": configValue,
                    "read": userConfig.read
                };

            };

            const configValue = !foundElement.blocked;

            console.log({
                "contact": true,
                "blocked": !configValue,
                "messages": configValue,
                "read": configValue ? foundElement.read : false
            });

            return {
                "contact": true,
                "blocked": !configValue,
                "messages": configValue,
                "read": configValue ? foundElement.read : false
            };

        } else if (chatType === "group") {

            const groupId = chatId;

            const currentJoinsGroup = await UserJoinsGroupFactory.findByUserId(this.id, groupId).catch((err) => {

                console.log(err);

            });

            if (!currentJoinsGroup) {

                return Promise.reject();

            };

            const group = await GroupFactory.findById(currentJoinsGroup.groupId).catch((err) => {

                console.log(err);

            });

            if (!group) {

                return Promise.reject();

            };

            const configValue = !currentJoinsGroup.blocked;

            console.log({
                "blocked": !configValue,
                "messages": configValue,
                "read": configValue ? currentJoinsGroup.read : false
            });

            return {
                "blocked": !configValue,
                "messages": configValue,
                "read": configValue ? currentJoinsGroup.read : false
            };

        };

        return Promise.reject();

    };

    async lookup(): Promise<IPOSTUserConfiguration> {

        if (!this.configId) {

            return Promise.resolve({
                "online": "lastOnline",
                "lastOnline": "everyone",
                "approve": "none",
                "writing": true,
                "read": true,
                "notify": true,
                "push": false,
                "email": true
            });

        };

        const elementFound = await UserConfigFactory.findById(this.configId).catch((err) => {

            console.log(err);

        });

        if (!elementFound) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

};


class UserFactory {

    private constructor() { };

    static async find(id: IUser["id"][]) {

        const isValid = Joi.array<IUser["id"][]>().items(idJoiSchema).min(1).validate(id, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserFactory class at find - joi validation: ${isValid.error.details[0].message}`);

        };

        const elementFound = await DataBase.collection("users").getMany({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from UserFactory class at find - rejected`);

        };

        return Promise.resolve(elementFound ? new UserComposite(elementFound) : null);

    };

    static async getConfig(userId: IUser["id"]): Promise<{
        approve: IUserConfiguration["approve"];
        writing: boolean;
        online: string;
        lastOnline: string;
        read: boolean;
    }> {

        console.log(`UserFactory userId inserted - ${userId ? userId : "null"}`);

        const owner = await this.findById(userId).catch((err) => {

            console.log(err);

        });

        if (owner === undefined) {

            return Promise.reject(`Error from UserFactory class at getConfig - failed finding the user by id - rejected`);

        };

        if (owner === null) {

            return Promise.reject(`Error from UserFactory class at getConfig - failed finding the user by id - user does not exist`);

        };

        if (!owner.configId) {

            console.log("current user does not have configuration");

            return Promise.resolve({
                "approve": "both",
                "writing": false,
                "online": "lastOnline",
                "lastOnline": "everyone",
                "read": false
            });

        };

        const elementFound = await UserConfigFactory.findById(owner.configId).catch((err) => {

            console.log(err);

        });

        if (!elementFound) {

            return Promise.reject(`Error from UserFactory class at getConfig - failed finding the configuration by id - rejected`);

        };

        return Promise.resolve(elementFound);

    };

    static async findByUsername(username: IUser["username"]) {

        const elementFound = await DataBase.collection("users").getOne({ username }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from UserFactory class at findByUsername - rejected`);

        };

        return elementFound;

    };

    static async findByEmail(email: IUser["email"]) {

        const elementFound = await DataBase.collection("users").getOne({ email }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from UserFactory class at findByEmail - rejected`);

        };

        return elementFound;

    };

    static async findByUsernameAndEmail(username: IUser["username"], email: IUser["email"]) {

        if (!username || !email) {

            return Promise.reject("Error from UserFactory class at findByUsernameOrEmail - both params must have value");

        };

        const elementFoundByUsername = await DataBase.collection("users").getOne({ username }).catch((err) => {

            console.log(err);

        });

        const elementFoundByEmail = await DataBase.collection("users").getOne({ email }).catch((err) => {

            console.log(err);

        });

        if (elementFoundByUsername === undefined || elementFoundByEmail === undefined) {

            return Promise.reject();

        };

        if (elementFoundByUsername === null && elementFoundByEmail === null) {

            return null;

        };

        return {
            "username": !!elementFoundByUsername,
            "email": !!elementFoundByEmail,
        };

    };

    static async findById(id: IUser["id"]): Promise<User | null> {

        const elementFound = await DataBase.collection("users").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from UserFactory class at findById - rejected`);

        };


        return Promise.resolve(elementFound ? new User(elementFound) : elementFound);

    };

    static async postOne(param: IPOSTUser): Promise<IUser> {

        const tailoredSchema: Joi.Schema<Required<IPOSTUser>> = userJoiSchema.tailor("signup");
        const isValid = tailoredSchema.validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from User class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        console.log("pre validation");
        console.log(param);
        console.log("post validation");
        console.log(isValid.value);

        const createdDate = new Date().toUTCString();

        const postedElement = await DataBase.collection("users").postOne({ "id": useId(), ...isValid.value, "created": createdDate, "lastOnline": createdDate }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject();

        };

        return Promise.resolve(postedElement);

    };

    static async touch(id: IUser["id"]): Promise<boolean> {

        const isValid = idJoiSchema.validate(id);

        if (isValid.error) {

            return Promise.reject(`Error from User class at touch - joi validation: ${isValid.error.details[0].message}`);

        };

        const updatedLastOnline = new Date().toUTCString()

        const updatedElement = await DataBase.collection("users").patchOne({ "id": id }, { "lastOnline": updatedLastOnline }).catch((err) => {

            console.log(err);

        });

        if (!updatedElement) {

            return Promise.reject(`Error from User class at touch - user could not update its lastOnline`);

        };

        return Promise.resolve(updatedElement);

    };

    static async patchOne(id: string, update: Partial<IPOSTUser> & { "configId"?: string }): Promise<boolean> {

        const updatedElement = await DataBase.collection("users").patchOne({ id }, update).catch((err) => {

            console.log(err);

        });

        if (!updatedElement) {

            return Promise.reject(`Error from UserFactory class at patchOne - rejected`);

        };

        return Promise.resolve(updatedElement);

    };

};

export default UserFactory;