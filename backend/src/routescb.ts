import { NextFunction, Request, Response } from "express";
import QueryString from "qs"
import UserContactsUserFactory from "./DAO/Entity/User/UserContactsUser";
import UserSendsMessageFactory from "./DAO/Entity/Message/UserSendsMessage";
import UserReceivesMessageFactory from "./DAO/Entity/Message/UserReceivesMessage";
import IRefUserSendsMessage from "./Types/Message/UserSendsMessage";
import { IUserReceivedMessage } from "./Types/Message/UserReceivesMessage";
import GroupFactory from "./DAO/Entity/User/Group";
import UserJoinsGroupFactory from "./DAO/Entity/User/UserJoinsGroup";
import IUserJoinsGroup, { IPOSTUserJoinsGroup } from "./Types/User/UserJoinsGroup";
import UserWebSocket from "./Types/UserWebSocket"
import IGroup from "./Types/User/Group";
import { PushSubscription } from "web-push";
import UserConnectionFactory from "./DAO/Entity/User/UserConnection";
import UserFactory from "./DAO/Entity/User/User";
import RegistrationFactory from "./DAO/Entity/Temp/Registration";
import transport from "./nodemailer";
import IRegistration from "./Types/Temp/Registration";
import IUser, { IPOSTUser } from "./Types/User/User";
import Joi from "joi";
import { CustomHandler } from "./Types/Handler";

export const signupCallback: CustomHandler<false, {}, { "id": string, "username": string, "password": string, "code": number }> = async (req, res, next) => {

    const errorOrigin = "Error from passport signup strategy";

    const registrationPending = await RegistrationFactory.findById(req.body.id).catch((err) => {

        console.log(err);

    });

    if (registrationPending === undefined) {

        res.status(500).json({ "status": "Rejected" });
        return;

    };

    if (registrationPending === null) {

        res.json({ "status": "registration eq null" });
        return;

    };

    const userExists = await UserFactory.findByUsernameAndEmail(req.body.username, registrationPending.email).catch((err) => {

        console.log(err);

    });

    if (userExists === undefined) {

        res.status(500).json({ "status": "Rejected" });
        return;

    };

    if (userExists) {

        if (userExists.username || userExists.email) {

            const fieldUsed = userExists.username ? "username" : userExists.email ? "email" : "";


            res.status(400).json({ "status": `${fieldUsed} is already in use` });
            // return done(`${errorOrigin} - ${fieldUsed} is already in use`, false);

        } else if (userExists.username && userExists.email) {


            res.status(400).json({ "status": `username and email are already in use` });
            // return done(`${errorOrigin} - username and email are already in use`, false);


        };

    };

    const signupUser = await UserFactory.postOne({ "username": req.body.username, "password": req.body.password, "email": registrationPending.email, "name": req.body.username }).catch((err) => {

        console.log(err);

    });

    if (signupUser === undefined) {

        res.status(500).json({ "status": "Rejected" });
        return;

    };

    res.status(201).json({ "status": "Created" });
    // done(null, signupUser);

    transport.sendMail({
        "from": { "address": "alexandrerivero16@gmail.com", "name": "texty" },
        "to": { "address": signupUser.email, "name": signupUser.username },
        "subject": "Registration",
        "html": `
        Your user account has been registered successfully
        `
    });

};

export const backupChatCallback: CustomHandler<true, { "chatId": string }> = async (req, res, next) => {

    console.log("backupChatCallback working...");

    const currentUser = req.user;

    const { chatId } = req.params;

    console.log(`chatId='${chatId}'`);

    const UserHasContact = await UserContactsUserFactory.findById(chatId).catch((err) => {

        console.log(err);

    });

    const UserJoinsGroup = await UserJoinsGroupFactory.findById(chatId).catch((err) => {

        console.log(err);

    });

    if (UserHasContact === undefined || UserJoinsGroup === undefined) {

        return console.log(`Error from backupChatCallback at getting ${UserHasContact === undefined ? "contact" : "join"} object`);

    };

    if (UserHasContact === null && UserJoinsGroup === null) {

        console.log(`backupChatCallback at getting ${UserHasContact === null ? "contact" : "join"} object - default response`);
        return res.json([]);

    };

    const userSendsMessage = await UserSendsMessageFactory.find({ "userId": [currentUser.id], chatId: [UserHasContact ? UserHasContact.contactId : chatId] }).catch((err) => {

        console.log(err);

    });

    if (userSendsMessage === undefined) {

        return;

    };

    const userReceivesMessage = await UserReceivesMessageFactory.find({ "userId": [currentUser.id], "chatId": [UserHasContact ? UserHasContact.contactId : chatId], "date": "$null" }).catch((err) => {

        console.log(err);

    });

    if (userReceivesMessage === undefined) {

        return;

    };

    const chatHistory = (Object.values(userSendsMessage ? userSendsMessage.elements : []) as (IRefUserSendsMessage | IUserReceivedMessage)[]).concat((userReceivesMessage ? userReceivesMessage.elements : []) as IUserReceivedMessage[]);

    const orderedByDate = chatHistory.sort((a, b) => {

        const date_a: Date = new Date(a.date),
            date_b: Date = new Date(b.date);

        return date_a.getTime() - date_b.getTime();

    });

    console.log("backup callback succeded --->");
    console.log(orderedByDate);

    res.json(orderedByDate);

};

export const getJoinListHandler: CustomHandler<true, { "id": string }> = async (req, res, next) => {

    console.log("getJoinListHandler began working...");
    console.log(`id='${req.params.id}'`);

    const currentUser = req.user as Express.User;

    const currentJoin = await UserJoinsGroupFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (!currentJoin) {

        console.log("Error from getJoinListHandler - UserJoinsGroupFactory.findById");
        return;

    };

    const joins = await UserJoinsGroupFactory.find({ "groupId": [currentJoin.groupId] }).catch((err) => {

        console.log(err);

    });

    if (joins === undefined) {

        console.log("Error from getJoinListHandler - UserJoinsGroupFactory.find");
        return;

    };

    res.json(joins ? joins : []);

};

export const getGroupListHandler: CustomHandler<true> = async (req, res, next) => {

    console.log("getGroupListHandler began working...");

    const currentUser = req.user as Express.User;

    const joins = await UserJoinsGroupFactory.find({ "userId": [currentUser.id] }).catch((err) => {

        console.log(err);

    });

    if (joins === undefined) {

        return;

    };

    if (joins === null) {

        res.json([]);
        return;

    };

    const groupIds = new Set<string>();

    joins.forEach((each) => {

        groupIds.add(each.groupId);

    });

    const groups = await GroupFactory.find({ "id": [...groupIds] }).catch((err) => {

        console.log(err);

    });

    if (groups === undefined) {

        return;

    };

    if (groups === null) {

        res.json([]);
        return;

    };

    if (joins.length === 0) {

        res.json([]);
        return;

    };

    const jsonResponse = joins.map((val) => {

        const currentGroup = groups.find((each) => each.id === val.groupId) as IGroup;

        return {
            "id": val.id,
            "type": "group",
            "name": currentGroup.name,
            "description": currentGroup.description
        };


    });

    console.log(`getGroupListHandler - groupList has value=${jsonResponse[0] ? "yes" : "no"}`);

    res.json(jsonResponse);

};

type IPOSTUserJoinsGroupUpdated = IPOSTUserJoinsGroup & { "name": string };
type IUserJoinsGroupUpdated = IUserJoinsGroup & { "name": string };

export const postGroupHandler: CustomHandler<true, {}, { "name": string, "description": string, "invitations": string[] }> = async (req, res, next) => {

    console.log("getGroupListHandler began working...");
    console.log("invitations", req.body.invitations);

    const currentUser = req.user as Express.User;

    const postedGroup = await GroupFactory.postOne({ "name": req.body.name, "description": req.body.description }).catch((err) => {

        console.log(err);

    });

    if (!postedGroup) {

        console.log(`postGroupHandler callback - group factory postOne method failed`);
        return;

    };

    const contactList = await UserContactsUserFactory.find({ "id": req.body.invitations }).catch((err) => {

        console.log(err);

    });

    if (!contactList) {

        console.log(`postGroupHandler callback - contact-list find method failed`);
        return;

    };

    console.log(`postGroupHandler callback - contact-list find method suceeded`);

    // const prepareJoins: IPOSTUserJoinsGroupUpdated[] = (contactList.map((val) => {

    //     return { "userId": val.contactId, "name": val.name, "groupId": postedGroup.id };

    // }) as IPOSTUserJoinsGroupUpdated[]).concat({ "userId": currentUser.id, "name": currentUser.username, "groupId": postedGroup.id, "admin": true });

    const prepareJoins: IPOSTUserJoinsGroup[] = (contactList.map((val) => {

        return { "userId": val.contactId, "groupId": postedGroup.id };

    }) as IPOSTUserJoinsGroup[]).concat({ "userId": currentUser.id, "groupId": postedGroup.id, "admin": true });

    const postedJoins = await UserJoinsGroupFactory.postMany(prepareJoins).catch((err) => {

        console.log(err);

    });

    if (!postedJoins) {

        return;

    };

    const userIds = contactList.map((val) => {

        return val.contactId;

    }).concat(currentUser.id);

    const userConns = await UserConnectionFactory.find(userIds).catch((err) => {

        console.log(err);

    });

    if (!userConns) {

        return;

    };

    const localPromise: Promise<{
        id: string;
        userId: string;
        name: string;
        date: string;
        admin: boolean;
    }[]> = new Promise((success, danger) => {

        const filteredJoins = postedJoins.filter((val) => val.userId !== currentUser.id).map(async (val) => {

            const foundContact = contactList.find((ele) => val.userId === ele.contactId);

            let user_name: string | null = foundContact ? foundContact.name : null;

            if (!user_name) {

                const currentContactUser = await UserFactory.findById(val.userId).catch((err) => {

                    console.log(err);

                });

                if (currentContactUser === undefined) {

                    throw new Error("");

                };

                user_name = currentContactUser ? currentContactUser.name : "Deleted User";

            };

            return { "id": val.id, "userId": val.userId, "name": user_name, "date": val.date, "admin": val.admin };

        });

        success(Promise.all(filteredJoins));

    });

    const currentJoin = postedJoins.find((val) => val.userId === currentUser.id) as IUserJoinsGroupUpdated;

    res.json({ "id": currentJoin.id, "name": postedGroup.name, "description": postedGroup.description, "admin": currentJoin.admin });

    // res.json({ "id": postedGroup.id, "name": postedGroup.name, "description": postedGroup.description, "joins": filteredJoins });

    const filteredJoins = await localPromise.catch((err) => {

        console.log(err);

    });

    if (!filteredJoins) {

        return;

    };

    userConns.forEach((user) => {

        if (!user.online) {

            return;

        };

        filteredJoins.forEach((each) => {

            if (!user.online) {

                return;

            };

            const currentConn = user.conn as UserWebSocket;

            if (each.userId === user.id) {

                currentConn.emit("join-group", { "id": each.id, "name": postedGroup.name, "admin": each.admin });
                return;

            };

            currentConn.emit("add-group-member", { "id": each.id, "name": each.name, "admin": each.admin });

        });

    });

    const currentConn = userConns.find((val) => val.id === currentUser.id);

    if (!currentConn || !currentConn.online) {

        return;

    };
    currentConn.online;

    filteredJoins.forEach((each) => {

        (currentConn.conn as UserWebSocket).emit("add-group-member", { "id": each.id, "name": each.name, "admin": each.admin });

    });

};