import Joi from "joi";
import IUserSendsMessage, { IPOSTUserSendsMessage, IUserSentMessage } from "../../../Types/Message/UserSendsMessage"
import { idJoiSchema, userSendsMessageJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import UserJoinsGroupFactory from "../User/UserJoinsGroup";
import UserFactory, { UserComposite } from "../User/User";
import UserReceivesMessageFactory, { UserReceivesMessageComposite } from "./UserReceivesMessage";
import { IPOSTUserReceivingMessage } from "../../../Types/Message/UserReceivesMessage";
import { IMessage } from "../../../Types/Message/Message";
import MessageFactory from "./Message";
import IUser from "../../../Types/User/User";
import { getManyModel } from "../../../Types/IDAOMethods";
import UserContactsUserFactory from "../User/UserContactsUser";
import MessageRequestFactory from "./Request";
import UserConnectionFactory from "../User/UserConnection";

export class UserSendsMessageComposite {

    public readonly elements: Partial<Record<IUserSendsMessage["id"], IUserSendsMessage>>;

    constructor(initialValue: IUserSendsMessage[]) {

        const result: Partial<Record<IUserSendsMessage["id"], IUserSendsMessage>> = {};

        initialValue.forEach((each) => {

            result[each.id] = each;

        });

        this.elements = result;

    };

    id(val: IUserSendsMessage["id"]) {

        return this.elements[val] as IUserSendsMessage;

    };

    async getUsers() {

        const userIds: Set<IUser["id"]> = new Set;

        for (const prop in this.elements) {

            userIds.add((this.elements[prop] as IUserSendsMessage).userId)

        };

        const users = await UserFactory.find([...userIds]).catch((err) => {

            console.log(err);

        });

        if (!users) {

            return Promise.reject();

        };

        return users;

    };

    async getMessages() {

        const messageIds: Set<IMessage["id"]> = new Set;

        for (const prop in this.elements) {

            messageIds.add((this.elements[prop] as IUserSendsMessage).messageId)

        };

        const unique: Partial<Record<IMessage["id"], IMessage>> = {};

        for (const key in this.elements) {

            unique[key] = undefined;

        };

        const messages = await MessageFactory.find([...messageIds]).catch((err) => {

            console.log(err);

        });

        if (!messages) {

            return Promise.reject();

        };

        messages.forEach((each) => {

            unique[each.id] = each;

        });

        return unique;

    };

};

export class UserSendsMessage implements IUserSentMessage {

    public readonly id;
    public readonly userId;
    public readonly messageId;
    public readonly date;
    public readonly chatType;
    public readonly chatId;
    public readonly replyType;
    public readonly replyId;

    constructor({ id, userId, messageId, date, chatType, chatId, replyType, replyId }: IUserSentMessage) {

        this.id = id;
        this.userId = userId;
        this.messageId = messageId;
        this.date = date;
        this.chatType = chatType;
        this.chatId = chatId;
        this.replyType = replyType;
        this.replyId = replyId;

    };

    async getReceives(): Promise<UserReceivesMessageComposite | null> {

        console.log("getReceives triggered");

        if (this.chatType === "contact") {

            const contactId = this.chatId;

            const contextUsers = await UserFactory.find([this.userId, contactId]).catch((err) => {

                console.log(err);

            });

            if (!contextUsers) {

                return Promise.reject();

            };

            const currentUser = contextUsers.id(this.userId),
                contactUser = contextUsers.id(contactId);

            const isAllowed_st = await currentUser.isAllowed("contact", contactId).catch((err) => {

                console.log(err);

            });

            const isAllowed_nd = await contactUser.isAllowed("contact", this.userId).catch((err) => {

                console.log(err);

            });

            if (!isAllowed_st || !isAllowed_nd) {

                console.log("ONE OF THE ALLOWED IS NULL");
                return Promise.reject();

            };

            if (!isAllowed_st.contact && !isAllowed_st.request && !isAllowed_nd.request && isAllowed_st.messages && isAllowed_nd.messages) {

                const currentUser = await UserFactory.findById(this.userId).catch((err) => {

                    console.log(err);

                });

                if (!currentUser) {

                    return Promise.reject();

                };
                const contactUser = await UserFactory.findById(this.chatId).catch((err) => {

                    console.log(err);

                });

                if (!contactUser) {

                    return Promise.reject();

                };

                const isAllowed = await currentUser.isAllowed("contact", this.chatId).catch((err) => {

                    console.log(err);

                });

                if (!isAllowed) {

                    return Promise.reject();

                };

                if (!isAllowed.request && (isAllowed.approve === "both" || isAllowed.approve === "contact")) {

                    const postedMessageRequest = await MessageRequestFactory.postOne({ "userId": this.userId, "contactId": this.chatId, "messageId": this.id }).catch((err) => {

                        console.log(err);

                    });

                    if (postedMessageRequest === undefined) {

                        return Promise.reject();

                    };

                    const currentUserConnection = await UserConnectionFactory.findById(this.userId).catch((err) => {

                        console.log(err);

                    });

                    if (!currentUserConnection) {

                        return Promise.reject();

                    };

                    console.log("cocacola:", Object.prototype.toString.call(postedMessageRequest));

                    if (currentUserConnection) {

                        if (currentUserConnection.online) {

                            currentUserConnection.conn?.emit("add-message-request", { "id": postedMessageRequest.id, "messageId": postedMessageRequest.messageId, "contactId": postedMessageRequest.contactId });

                        };

                    };

                    const contactUserConnection = await UserConnectionFactory.findById(this.chatId).catch((err) => {

                        console.log(err);

                    });

                    if (contactUserConnection === undefined) {

                        return Promise.reject();

                    };

                    if (contactUserConnection) {

                        if (contactUserConnection.online) {

                            contactUserConnection.conn?.emit("add-message-request", { "id": postedMessageRequest.id, "userId": postedMessageRequest.userId, "messageId": postedMessageRequest.messageId });

                        };

                    };

                };

            }else if (!isAllowed_st.messages || !isAllowed_nd.messages || isAllowed_st.request || isAllowed_nd.request) {

                console.log("MESSAGES IS NOT ALLOWED");
                return Promise.resolve(null);

            };

            console.log("Data being set for user receive message object to be created", { ...this, "userId": contactId, "sendId": this.id });

            const postedUserReceivesMessage = await UserReceivesMessageFactory.postOne({ ...this, "userId": contactId, "chatId": this.userId, "sendId": this.id }).catch((err) => {

                console.log(err);

            });

            if (!postedUserReceivesMessage) {

                return Promise.reject();

            };

            return Promise.resolve(new UserReceivesMessageComposite([postedUserReceivesMessage]));

        } else if (this.chatType === "group") {

            // const currentJoinsGroup = await UserJoinsGroupFactory.findById(this.chatId).catch((err) => {

            //     console.log(err);

            // });

            // if (!currentJoinsGroup) {

            //     return Promise.reject();

            // };

            const usersJoinGroup = await UserJoinsGroupFactory.find({ "groupId": [this.chatId] }).catch((err) => {

                console.log(err);

            });

            if (usersJoinGroup === undefined) {

                return Promise.reject();

            };

            if (usersJoinGroup === null) {

                return Promise.resolve(null);

            };

            usersJoinGroup.splice(usersJoinGroup.findIndex((e) => e.userId === this.userId), 1);

            const receiverIds = usersJoinGroup.map((e) => e.userId);

            const receiverUsers = await UserFactory.find(receiverIds).catch((err) => {

                console.log(err);

            });

            if (!receiverUsers) {

                return Promise.reject();

            };

            const isAllowed_1 = receiverUsers.isAllowed("contact", this.userId), isAllowed_2 = receiverUsers.isAllowed("contact", this.userId, true);

            const isAllowed = await Promise.all([isAllowed_1, isAllowed_2]).catch((err) => {

                console.log(err);

            });

            if (!isAllowed) {

                return Promise.reject();

            };

            const currentUser = await UserFactory.findById(this.userId).catch((err) => {

                console.log(err);

            });

            if (!currentUser) {

                return Promise.reject();

            };

            const currentUserConfig = await currentUser.lookup().catch((err) => {

                console.log(err);

            });

            if (!currentUserConfig) {

                return Promise.reject();

            };

            const filteredUsersJoinGroup = usersJoinGroup.filter(async (value) => {

                const receiverAllows = isAllowed[0][value.userId],
                    userAllows = isAllowed[1][value.userId];

                if (!receiverAllows || !userAllows) {

                    return true;

                };

                if (userAllows.blocked) {

                    return false;

                };

                return receiverAllows.messages;

            });

            console.log(`UserSendsMessage class at getReceives - filteredUsersJoinGroup =`, filteredUsersJoinGroup);

            if (!filteredUsersJoinGroup[0]) {

                return Promise.resolve(null);

            };

            const usersReceiveMessage: IPOSTUserReceivingMessage[] = filteredUsersJoinGroup.map((each) => {

                const userReceivesMessage: IPOSTUserReceivingMessage = { "userId": each.userId, "sendId": this.id, "chatType": this.chatType, "chatId": this.chatId };

                if (this.replyType && this.replyId) {

                    userReceivesMessage.replyType = this.replyType === "send" ? "receive" : "send";
                    userReceivesMessage.replyId = this.replyId;

                };

                return userReceivesMessage;

            });

            const postedUsersReceiveMessage = await UserReceivesMessageFactory.postMany(usersReceiveMessage).catch((err) => {

                console.log(err);

            });

            if (!postedUsersReceiveMessage) {

                return Promise.reject();

            };

            return Promise.resolve(new UserReceivesMessageComposite(postedUsersReceiveMessage))

        };

        return Promise.resolve(null);

    };

};

class UserSendsMessageFactory {

    private constructor() { };

    static async find(param: getManyModel<Pick<IUserSendsMessage, "id" | "userId" | "chatId">>) {

        console.log(`UserSendsMessageFactory at find - param -`, param);

        const isValid = Joi.object<{ id: IUserSendsMessage["id"][], userId: IUser["id"][], chatId: string[] }, true>({
            "id": Joi.array<IUserSendsMessage["id"][]>().items(idJoiSchema).min(1),
            "userId": Joi.array<IUser["id"][]>().items(idJoiSchema).min(1),
            "chatId": Joi.array<string[]>().items(idJoiSchema).min(1)
        }).validate(param);

        if (isValid.error) {

            return Promise.reject(`Error from UserSendsMessageFactory class at find - joi validation: ${isValid.error.details[0].message}`);

        };

        const elementFound = await DataBase.collection("user-sends-message").getMany(param).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from UserSendsMessageFactory class at find - rejected`);

        };

        return Promise.resolve(elementFound ? new UserSendsMessageComposite(elementFound) : null);

    };

    static async findById(id: IUserSendsMessage["id"]): Promise<IUserSendsMessage | null> {

        const elementFound = await DataBase.collection("user-sends-message").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from UserSendsMessageFactory class at findById - rejected`);

        };

        return Promise.resolve(elementFound);

    };

    static async postMany(param: IPOSTUserSendsMessage[]): Promise<IUserSentMessage[]> {

        const tailoredSchema: Joi.Schema<IPOSTUserSendsMessage> = userSendsMessageJoiSchema.tailor("post");
        const isValid = Joi.array<IPOSTUserSendsMessage[]>().items(tailoredSchema).validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserSendsMessageFactory class at postMany - joi validation:${isValid.error.details[0].message}`);

        };

        const idGenerated: IUserSendsMessage[] = isValid.value.map((each) => {

            return { ...each, "id": useId() };

        });

        const postedArray = await DataBase.collection("user-sends-message").postMany(idGenerated).catch((err) => {

            console.log(err);

        });

        if (!postedArray) {

            return Promise.reject();

        };

        return Promise.resolve(postedArray);

    };

    static async postOne(param: IPOSTUserSendsMessage): Promise<UserSendsMessage> {

        const tailoredSchema: Joi.Schema<IPOSTUserSendsMessage> = userSendsMessageJoiSchema.tailor("post");
        const isValid = tailoredSchema.validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserSendsMessageFactory class at postOne - joi validation:${isValid.error.details[0].message}`);

        };

        const postedElement = await DataBase.collection("user-sends-message").postOne({ "id": useId(), ...isValid.value }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject(`Error from UserSendsMessageFactory class at postOne - rejected`);

        };

        return Promise.resolve(new UserSendsMessage(postedElement));

    };

    static async patchOne(param: { "id": string, "deliveredDate"?: IUserSendsMessage["deliveredDate"], "readDate"?: IUserSendsMessage["readDate"] }): Promise<boolean> {

        const updatedElement = await DataBase.collection("user-sends-message").patchOne({ "id": param.id }, { "deliveredDate": param.deliveredDate }).catch((err) => {

            console.log(err);

        });

        if (!updatedElement) {

            return Promise.reject(`Error from UserSendsMessageFactory class at postOne - rejected`);

        };

        return Promise.resolve(updatedElement);

    };

};



export default UserSendsMessageFactory;