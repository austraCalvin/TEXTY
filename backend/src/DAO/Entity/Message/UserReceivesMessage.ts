import Joi from "joi";
import IUserReceivesMessage, { IEDITUserReceivesMessage, IPOSTUserReceivingMessage, IUserReadMessage } from "../../../Types/Message/UserReceivesMessage";
import { dateJoiSchema, idJoiSchema, userReceivesMessageJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import IUserSendsMessage from "../../../Types/Message/UserSendsMessage";
import IUser from "../../../Types/User/User";
import UserSendsMessageFactory, { UserSendsMessageComposite } from "./UserSendsMessage";
import { getManyModel } from "../../../Types/IDAOMethods";
import UserJoinsGroupFactory from "../User/UserJoinsGroup";
import UserContactsUserFactory from "../User/UserContactsUser";

export class UserReceivesMessageComposite {

    public readonly elements: UserReceivesMessage[];

    constructor(initialValue: IUserReceivesMessage[]) {

        this.elements = initialValue ? (initialValue[0] ? initialValue.map((element) => new UserReceivesMessage(element)) : []) : [];

    };

    id(val: string) {

        const foundIndex = this.elements.findIndex((element) => (element.id === val));

        return foundIndex === -1 ? null : new UserReceivesMessage(this.elements[foundIndex]);

    };

    async lookup() {

        const unique: Partial<Record<IUserSendsMessage["id"], IUserSendsMessage>> = {};

        this.elements.forEach((each) => {

            unique[each.sendId] = undefined;

        });

        const userSendsMessage = await UserSendsMessageFactory.find({ "id": Object.keys(unique) }).catch((err) => {

            console.log(err);

        });

        if (!userSendsMessage) {

            return Promise.reject();

        };

        for (const key in userSendsMessage.elements) {

            unique[(userSendsMessage.elements[key] as IUserSendsMessage).id] = userSendsMessage.elements[key];

        };

        const result = Object.entries(unique).map((each) => {

            return each[1] as IUserSendsMessage;

        });

        return new UserSendsMessageComposite(result);

    };

    forEach(callback: (each: UserReceivesMessage) => void) {

        for (let index = 0; index < this.elements.length; index++) {

            callback(this.elements[index]);

        };

    };

    filter(callback: (each: IUserReceivesMessage) => unknown) {

        return this.elements.filter(callback);

    };

};

export class UserReceivesMessage implements IUserReceivesMessage {

    public readonly id;
    public readonly userId;
    // public readonly messageId;
    // public readonly senderId;
    public readonly sendId;
    public readonly date;
    public readonly chatType;
    public readonly chatId;
    public readonly replyType;
    public readonly replyId;

    constructor({ id, userId, sendId, date, chatType, chatId, replyType, replyId }: IUserReceivesMessage) {

        this.id = id;
        this.userId = userId;
        // this.messageId = messageId;
        // this.senderId = senderId;
        this.sendId = sendId;
        this.date = date;
        this.chatType = chatType;
        this.chatId = chatId;
        this.replyType = replyType;
        this.replyId = replyId;

    };

    async lookup() {

        const userSendsMessage = await UserSendsMessageFactory.findById(this.sendId).catch((err) => {

            console.log(err);

        });

        if (!userSendsMessage) {

            return Promise.reject();

        };

        return userSendsMessage;

    };

    async getSenderId() {

        const sendMessage = await this.lookup().catch((err) => {

            console.log(err);

        });

        if (!sendMessage) {

            return Promise.reject();

        };

        if (this.chatType === "contact") {

            return this.chatId;

        } else {

            return sendMessage.userId;

        };

    };

};

class UserReceivesMessageFactory {

    private constructor() { };

    static async find(filter: getManyModel<Pick<IUserReadMessage, "userId" | "date" | "readDate" | "sendId" | "chatId">>) {

        // const localJoiSchema = Joi.object<{ userId: IUser["id"][], "date": Date, "readDate": Date, "chatId": string[] }, true>({
        //     "userId": Joi.array<IUser["id"][]>().items(idJoiSchema).min(1),
        //     "chatId": Joi.array<string[]>().items(idJoiSchema).min(1),
        //     // "senderId": Joi.array<IUser["id"][]>().items(idJoiSchema).min(1),
        //     "date": dateJoiSchema.allow(true),
        //     "readDate": dateJoiSchema.allow(true),
        // });

        // const isValid = localJoiSchema.validate(filter);

        // if (isValid.error) {

        //     return Promise.reject(`Error from UserReceivesMessageFactory class at find - joi validation: ${isValid.error.details[0].message}`);

        // };

        const elementFound = await DataBase.collection("user-receives-message").getMany(filter).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from UserReceivesMessageFactory class at getMany - rejected`);

        };

        if (elementFound === null) {

            return null;

        };

        return new UserReceivesMessageComposite(elementFound);

    };

    static async findById(id: IUserReceivesMessage["id"]) {

        const isValid = idJoiSchema.validate(id);

        if (isValid.error) {

            return Promise.reject(`Error from UserReceivesMessageFactory class at findById - joi validation:${isValid.error.details[0].message}`);

        };

        const elementFound = await DataBase.collection("user-receives-message").getOne({ "id": isValid.value }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        if (elementFound === null) {

            return null;

        };

        return new UserReceivesMessage(elementFound);

    };

    static async patchOne(id: IUserReceivesMessage["id"], update: IEDITUserReceivesMessage) {

        const isValid = idJoiSchema.validate(id);

        if (isValid.error) {

            return Promise.reject(`Error in UserReceivesMessageFactory class  - joi validation: ${isValid.error.details[0].message}`);

        };

        const acknowledged = await DataBase.collection("user-receives-message").patchOne({ "id": isValid.value }, update).catch((err) => {

            console.log(err);

        });

        if (acknowledged === undefined) {

            return Promise.reject(`Error from UserReceivesMessageFactory class at patchOne - rejected`);

        };

        return Promise.resolve(acknowledged);

    };

    static async postMany(param: IPOSTUserReceivingMessage[]): Promise<IUserReceivesMessage[]> {

        const tailoredSchema: Joi.Schema<IPOSTUserReceivingMessage> = userReceivesMessageJoiSchema.tailor("post");
        const isValid = Joi.array<IPOSTUserReceivingMessage[]>().items(tailoredSchema).validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserReceivesMessageFactory class at postMany - joi validation: ${isValid.error.details[0].message}`);

        };

        const idGenerated: IUserReceivesMessage[] = isValid.value.map((each) => {

            return { ...each, "id": useId() };

        });

        const postedArray = await DataBase.collection("user-receives-message").postMany(idGenerated).catch((err) => {

            console.log(err);

        });

        if (!postedArray) {

            return Promise.reject(`Error from UserReceivesMessageFactory class at postMany - rejected`);

        };

        return Promise.resolve(postedArray);

    };

    static async postOne(param: IPOSTUserReceivingMessage): Promise<IUserReceivesMessage> {

        console.log("user receive message object to be posted", param);

        const tailoredSchema: Joi.Schema<IPOSTUserReceivingMessage> = userReceivesMessageJoiSchema.tailor("post");
        const isValid = tailoredSchema.validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserReceivesMessageFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        console.log("user receive message object after joi validation", isValid.value);

        const postedElement = await DataBase.collection("user-receives-message").postOne({ "id": useId(), ...isValid.value }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject(`Error from UserReceivesMessageFactory class at postOne - rejected`);

        };

        return Promise.resolve(postedElement);

    };

};

export default UserReceivesMessageFactory;