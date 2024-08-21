// import IUser, { IAuthenticatedUser, ISessionUser } from "../../../Types/User/User";
// import Joi from "joi";
// import IMessage, { IFileAttachedMessage, IPlainTextMessage } from "../../../Types/Message/Message";
// import UserWebSocket from "../../../Types/UserWebSocket"
// import { idJoiSchema, userJoiSchema } from "../../../hooks/JoiSchema";
// import { DataBaseOptions, ServiceDataBaseOptions } from "../../../Types/DataBase";
// import IUserSendsMessage, { IPOSTUserSendingMessage } from "../../../Types/Message/UserSendsMessage";
// import crypto from "crypto";
// import ModelFactory, { databaseChose } from "../../DataBase/Model";
// import { IPOSTFile } from "../../../Types/Message/File";
// import { IFileAttachedMessagePending, IMessagePending, IPlainTextMessagePending } from "../../../Types/SocketEvents";
// import IUserReceivesMessage, { IPOSTUserReceivingMessage, IUserReceivedMessage } from "../../../Types/Message/UserReceivesMessage";
// import UserSendsMessageFactory from "../Message/UserSendsMessage";
// import IUserConnection, { IPOSTUserConnection } from "../../../Types/User/UserConnection";
// import DataBase, { SessionStorageDB } from "../../DataBase/Config";
// import MessageFactory from "../Message/Message";
// import UserReceivesMessageFactory from "../Message/UserReceivesMessage";
// import UserJoinsGroupFactory from "./UserJoinsGroup";

// abstract class IUserOnline {

//     protected readonly user;

//     constructor(user: UserConnection) {

//         this.user = user;

//     };

//     abstract send(userSends: IPOSTUserSendingMessage, message: IPlainTextMessagePending): Promise<IUserSendsMessage>;
//     abstract send(userSends: IPOSTUserSendingMessage, message: IFileAttachedMessagePending): Promise<IUserSendsMessage>;
//     abstract receive(userReceivesMessage: IUserReceivesMessage, message: IMessage): Promise<IUserReceivedMessage>;

// };

// export class UserOnline extends IUserOnline {

//     constructor(user: UserConnection) {

//         super(user);

//         //message-pending
//         user.connection.on("message-pending", async (userSends, message, callback) => {

//             let localPromise: Promise<IUserSendsMessage>;

//             if (message.file) {

//                 localPromise = user.send(userSends, message);

//             } else {

//                 localPromise = user.send(userSends, message);

//             };

//             localPromise.then((userSentMessage) => {

//                 callback(userSentMessage);

//             }).catch((err) => {

//                 if (err) {

//                     callback(undefined);

//                 };

//             });

//         });

//         //message-sent
//         DataBase.collection("user-sends-message").getMany({ "userId": user.id }).then((userSendsMessages) => {

//             if (userSendsMessages === null) {

//                 return Promise.reject("user-sends-message not found");

//             };

//             userSendsMessages.forEach((each) => {

//                 user.connection.emit("message-sent", each);

//             });

//         }).catch((err) => {

//             console.log(err);

//         });

//         //message-to-deliver
//         DataBase.collection("user-receives-message").getMany({ "userId": user.id, "date": undefined }).then((userReceivesMessages) => {

//             if (!userReceivesMessages) {

//                 return Promise.reject("user-receives-message not found");

//             };

//             userReceivesMessages.forEach(async (each) => {

//                 const message = await DataBase.collection("messages").getOne({ "id": each.messageId }).catch((err) => {

//                     console.log(err);

//                 });

//                 if (message === undefined) {

//                     return Promise.reject();

//                 };

//                 if (message === null) {

//                     return Promise.reject("message not found");

//                 };

//                 const currentUser = await SessionStorageDB.collection("userConnections").getOne({ "id": user.id }).catch((err) => { });

//                 if (!currentUser) {

//                     return;

//                 };

//                 let localPromise: Promise<IUserReceivedMessage>;

//                 if (message.fileId) {

//                     localPromise = currentUser.receive(each, message as IFileAttachedMessage);

//                 } else {

//                     localPromise = currentUser.receive(each, message as IPlainTextMessage)

//                 };

//                 localPromise.catch((err) => { });

//             });

//         }).catch((err) => {

//             console.log(err);

//         });

//         //message-delivered
//         user.connection.on("message-delivered", (deliveredMessage) => {

//             DataBase.collection("user-receives-message").patchOne({ "id": deliveredMessage.id }, { "date": deliveredMessage.date }).then(async (acknowledged) => {

//                 const userReceivedMessage = await DataBase.collection("user-receives-message").getOne({ "id": deliveredMessage.id }).catch((err) => {

//                     console.log(err);

//                 });

//                 if (userReceivedMessage === undefined) {

//                     return;

//                 };

//                 if (userReceivedMessage === null) {

//                     return Promise.reject("user-receives-message not found");

//                 };

//                 if (userReceivedMessage.chatType === "contact") {

//                     const userContactsUser = await DataBase.collection("user-contacts-user").getOne({ "userId": user.id, "contactId": userReceivedMessage.senderId }).catch((err) => {

//                         console.log(err);

//                     });

//                     if (userContactsUser === undefined) {

//                         return;

//                     };

//                     if (userContactsUser === null) {

//                         return Promise.reject("user-contacts-user not found");

//                     };

//                     if (userContactsUser.blocked) {

//                         return;

//                     };

//                     DataBase.collection("user-sends-message").patchOne({ "id": userReceivedMessage.sendId }, { "deliveredDate": userReceivedMessage.date });

//                 };

//                 if (userReceivedMessage.chatType === "group") {

//                     const userReceivingMessage = await DataBase.collection("user-receives-message").getOne({
//                         "senderId": userReceivedMessage.senderId, "sendId": userReceivedMessage.sendId, "chatType": "group", "chatId": userReceivedMessage.chatId, "date": undefined
//                     }).catch((err) => {

//                         console.log(err);

//                     });

//                     if (userReceivingMessage === undefined) {

//                         return;

//                     };

//                     if (userReceivingMessage) {

//                         return;

//                     };

//                     DataBase.collection("user-sends-message").patchOne({ "id": userReceivedMessage.sendId }, { "deliveredDate": userReceivedMessage.date });

//                 };

//             }).catch((err) => {

//                 console.log(err)

//             });

//         });

//         //message-read
//         user.connection.on("message-read", async (readMessages) => {

//             DataBase.collection("user-receives-message").getMany({ "userId": user.id, "readDate": undefined }).then((userReceivesMessages) => {

//                 if (userReceivesMessages === null) {

//                     return Promise.reject("user-receives-message not found");

//                 };

//                 const filteredUserReceivesMessages = userReceivesMessages.filter(async (each) => {

//                     if (each.chatType === "contact") {

//                         const isAllowed = await DataBase.collection("user-contacts-user").getOne({ "userId": user.id, "contactId": each.senderId }).catch((err) => {

//                             console.log(err);

//                         });

//                         if (isAllowed === undefined) {

//                             return false;

//                         };

//                         if (isAllowed === null) {

//                             return false;

//                         };

//                         if (isAllowed.blocked || isAllowed.read) {

//                             return false;

//                         };

//                     };

//                     if (each.chatType === "group") {

//                         const isAllowed = await UserJoinsGroupFactory.findById(each.id).catch((err) => {

//                             console.log(err);

//                         });

//                         if (!isAllowed) {

//                             return;

//                         };

//                         if (isAllowed.blocked || isAllowed.read) {

//                             return false;

//                         };

//                     };

//                 });

//                 const patchedReceives = filteredUserReceivesMessages.map((each) => {

//                     return DataBase.collection("user-receives-message").patchOne({ "id": each.id }, { "readDate": readMessages[each.id] });

//                 });

//                 Promise.all(patchedReceives).then(() => {



//                 }).catch((err) => { });

//             }).catch((err) => {

//                 console.log(err);

//             });



//         });

//     };

//     async send(userSends: IPOSTUserSendingMessage, message: IPlainTextMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendingMessage, message: IFileAttachedMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendingMessage, message: IMessagePending): Promise<IUserSendsMessage> {

//         const localPromise: Promise<IUserSendsMessage> = new Promise(async (success, danger) => {

//             let postedMessagePromise: Promise<IMessage>;

//             if (message.file) {

//                 postedMessagePromise = MessageFactory.postOne({ "body": message.body, "file": message.file });

//             } else {

//                 postedMessagePromise = MessageFactory.postOne({ "body": message.body });

//             };

//             const postedMessage = await postedMessagePromise.catch((err) => {

//                 danger(err);

//             });

//             if (!postedMessage) {

//                 return;

//             };

//             const postedUserSendsMessage = await UserSendsMessageFactory.postOne({ "messageId": postedMessage.id, ...userSends, "userId": this.user.id }).catch((err) => {

//                 danger(err);

//             });

//             if (!postedUserSendsMessage) {

//                 return;

//             };

//             success(postedUserSendsMessage);

//             if (userSends.chatType === "contact") {

//                 const postedUserReceivesMessage = await UserReceivesMessageFactory.postOne({ ...userSends, "userId": userSends.chatId, "senderId": this.user.id, "sendId": postedUserSendsMessage.id, "messageId": postedMessage.id }).catch((err) => {

//                     danger(err);

//                 });

//                 if (!postedUserReceivesMessage) {

//                     return;

//                 };

//                 const contactUser = await UserConnectionFactory.findById(postedUserReceivesMessage.userId).catch((err) => {

//                     danger(err);

//                 });

//                 if (!contactUser) {

//                     return;

//                 };

//                 let localPromise: Promise<IUserReceivedMessage>;

//                 if (postedMessage.fileId) {

//                     localPromise = contactUser.receive(postedUserReceivesMessage, postedMessage as IFileAttachedMessage);

//                 } else {

//                     localPromise = contactUser.receive(postedUserReceivesMessage, postedMessage as IPlainTextMessage);

//                 };

//                 localPromise.catch((err) => {

//                     danger(err);

//                 });

//             };

//             if (userSends.chatType === "group") {

//                 const usersJoinGroup = await UserJoinsGroupFactory.getMany({ "groupId": userSends.chatId }).catch((err) => {

//                     danger(err);

//                 });

//                 if (!usersJoinGroup) {

//                     return;

//                 };

//                 const filteredUsersJoinGroup = usersJoinGroup.filter((value) => {

//                     if (value.date.getTime() < postedUserSendsMessage.date.getTime()) {

//                         if (value.blocked) {

//                             return false;

//                         };

//                         return true;

//                     };

//                 });

//                 const usersReceivesMessage: IPOSTUserReceivingMessage[] = filteredUsersJoinGroup.map((each) => {

//                     const userReceivesMessage: IPOSTUserReceivingMessage = { ...userSends, "userId": each.id, "senderId": this.user.id, "sendId": postedUserSendsMessage.id, "messageId": postedUserSendsMessage.messageId };

//                     if (userSends.replyType && userSends.replyId) {

//                         userReceivesMessage.replyType = userSends.replyType === "send" ? "receive" : "send";
//                         userReceivesMessage.replyId = userSends.replyId;

//                     };

//                     return userReceivesMessage;

//                 });

//                 const postedUsersReceivesMessage = await UserReceivesMessageFactory.postMany(usersReceivesMessage).catch((err) => {

//                     danger(err);

//                 });

//                 if (!postedUsersReceivesMessage) {

//                     return;

//                 };

//                 postedUsersReceivesMessage.forEach(async (each) => {

//                     const currentContactUser = await UserConnectionFactory.findById(each.userId).catch((err) => {

//                         danger(err);

//                     });

//                     if (!currentContactUser) {

//                         return;

//                     };

//                     let localPromise: Promise<IUserReceivedMessage>;

//                     if (postedMessage.fileId) {

//                         localPromise = currentContactUser.receive(each, postedMessage as IFileAttachedMessage);

//                     } else {

//                         localPromise = currentContactUser.receive(each, postedMessage as IPlainTextMessage);

//                     };

//                     localPromise.catch((err) => {

//                         danger(err);

//                     });

//                 });

//             };

//         });

//         return localPromise;

//     };

//     async receive(userReceivesMessage: IUserReceivesMessage, message: IMessage): Promise<IUserReceivedMessage> {

//         const localPromise: Promise<IUserReceivedMessage> = new Promise((success, danger) => {

//             this.user.connection.emit("message-to-deliver", { ...userReceivesMessage, ...message }, (deliveredMessage) => {

//                 DataBase.collection("user-receives-message").patchOne({ "id": userReceivesMessage.id }, { "date": deliveredMessage.date }).then(() => {

//                     success({ ...userReceivesMessage, "date": deliveredMessage.date });

//                 }).catch((err) => {

//                     danger(err);

//                 });

//             });

//         });

//         return localPromise;

//     };

// };

// export class UserOffline extends IUserOnline {

//     constructor(user: UserConnection) {

//         super(user);

//     };

//     async send(userSends: IPOSTUserSendingMessage, message: IPlainTextMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendingMessage, message: IFileAttachedMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendingMessage, message: IMessagePending): Promise<IUserSendsMessage> {

//         return Promise.reject();

//     };

//     async receive(userReceivesMessage: IUserReceivesMessage, message: IMessage): Promise<IUserReceivedMessage> {

//         return Promise.reject();

//     };

// };
// export class UserConnection implements ISessionUser {

//     private state: IUserOnline;
//     public readonly id;
//     public readonly connection;

//     constructor(id: ISessionUser["id"], connection: UserWebSocket) {

//         this.state = new UserOnline(this);
//         this.id = id;
//         this.connection = connection;

//     };

//     setOnline(state: boolean): void {

//         if (state) {

//             this.state = new UserOnline(this);
//             return;

//         };

//         this.state = new UserOffline(this);

//     };

//     async send(userSends: IPOSTUserSendingMessage, message: IPlainTextMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendingMessage, message: IFileAttachedMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendingMessage, message: IMessagePending): Promise<IUserSendsMessage> {

//         if (message.file) {

//             return await this.state.send(userSends, message);

//         };

//         return await this.state.send(userSends, message);

//     };
//     async receive(userReceivesMessage: IUserReceivesMessage, message: IMessage): Promise<IUserReceivedMessage> {

//         return await this.state.receive(userReceivesMessage, message);

//     };

// };

// class UserConnectionFactory {

//     private constructor() { };

//     static async findById(id: IUser["id"]): Promise<IUserConnection | null> {

//         const elementFound = await SessionStorageDB.collection("userConnections").getOne({ id }).catch((err) => {

//             console.log(err);

//         });

//         if (elementFound === undefined) {

//             return Promise.reject();

//         };

//         return Promise.resolve(elementFound);

//     };

//     static async postOne(id: ISessionUser["id"], connection: UserWebSocket): Promise<UserConnection> {

//         const postedUserConnection = await SessionStorageDB.collection("userConnections").postOne(new UserConnection(id, connection)).catch((err) => {

//             console.log(err);

//         });

//         if (!postedUserConnection) {

//             return Promise.reject();

//         };

//         return Promise.resolve(postedUserConnection as UserConnection);

//     };

//     static async listen(id: ISessionUser["id"], connection: UserWebSocket): Promise<UserConnection> {

//         const isValid = idJoiSchema.validate(id);

//         if (isValid.error) {

//             return Promise.reject(`Error from UserConnectionFactory class at listen - joi validation: ${isValid.error.details[0].message}`);

//         };

//         const foundElement = await this.findById(id).catch((err) => {

//             console.log(err);

//         });

//         if (foundElement === undefined) {

//             return Promise.reject();

//         };

//         if (foundElement === null) {

//             const userExists = await DataBase.collection("users").getOne({ id }).catch((err) => {

//                 console.log(err);

//             });

//             if (userExists === undefined) {

//                 return Promise.reject();

//             };

//             if (userExists === null) {

//                 return Promise.reject("Error from UserConnectionFactory class at listen - user does not exist");

//             };

//             const currentSession = await this.postOne(userExists.id, connection).catch((err) => {

//                 console.log(err);

//             });

//             if (!currentSession) {

//                 return Promise.reject();

//             };

//             return Promise.resolve(currentSession);

//         };

//         return Promise.resolve(new UserConnection(id, connection));

//     };

// };

// export default UserConnectionFactory;